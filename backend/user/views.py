# user/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.utils import IntegrityError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from invitations.utils import get_invitation_model

from dj_rest_auth.registration.app_settings import RegisterSerializer
from dj_rest_auth.app_settings import TokenSerializer, create_token
from dj_rest_auth.models import TokenModel

from user.serializers import UserViewSerializer
from user.permissions import IsAdmin
from user.utils import is_admin, key_expired


class UserList(generics.ListAPIView):
    '''
    Get all the users or get user(s) by username with search query
    Route- /users/?<s=username>/
    Access- Admin only
    '''
    permission_classes = (IsAuthenticated, IsAdmin)
    serializer_class = UserViewSerializer

    def get_queryset(self):
        queryset = get_user_model().objects.all()

        # Check the search query_params
        search = self.request.query_params.get('s')
        if search:
            return queryset.filter(username__icontains=search)

        return queryset


class UserDetail(generics.RetrieveAPIView):
    '''
    Get a user by user id
    Route- /users/<int:pk>
    Access- Admin only
    '''
    permission_classes = (IsAuthenticated, IsAdmin)
    queryset = get_user_model().objects.all()
    serializer_class = UserViewSerializer


# Route: /auth/invite/
# Access: Admin only
# Methods: POST
# Description: Send email invitation to register a normal user
@api_view(['POST'])
def user_invite(request):
    """
    Receive a email address from request then send an invitation
    for registration
    eg json- {"email": "user@email.com"}
    """

    if request.method == 'POST':
        user = request.user
        email = request.data.get('email')
        Invitation = get_invitation_model()

        if not user:
            return Response({'detail': 'Not authorized'},
                            status=status.HTTP_403_FORBIDDEN)

        if not is_admin(user):
            return Response({'detail': 'Not authorized as admin'},
                            status=status.HTTP_403_FORBIDDEN)

        if not email:
            return Response({'detail': 'Email field is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        if is_admin(user) and email:
            try:
                validate_email(email)
            except ValidationError:
                return Response({'detail': 'Email address is invalid'},
                                status=status.HTTP_400_BAD_REQUEST)

            # check if the email already in user database
            if get_user_model().objects.filter(email=email):
                return Response({'detail': 'User with this email exists'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Check if the email is in the invitation database,
            # if exists check if it's expired, if expired delete it
            if Invitation.objects.filter(email=email):
                invite = Invitation.objects.get(email=email)
                if not invite.accepted:
                    if key_expired(invite):
                        invite.delete()
                        return Response({
                            'detail':
                            'Email exists in the invite list but ' +
                            'expired, resend request again for ' +
                            'create new invite.'},
                            status=status.HTTP_400_BAD_REQUEST)

            try:
                invite = Invitation.create(email, inviter=user)
                invite.send_invitation(request)
            except IntegrityError:
                return Response({'detail': 'Email already exists in invite'},
                                status=status.HTTP_400_BAD_REQUEST)

            return Response({'detail': 'Email successfully send'},
                            status=status.HTTP_200_OK)


# Route: /auth/accept/?<email=true>
# Access: public
# Methods: POST
# Description: accept email verified user, and register
@api_view(['POST'])
def user_accept(request):
    """
    Receive email, password and key from request then regiter a user,
    eg json-
    {
        "email": "user@email.com",
        "password": "newpassword",
        "key": "key from invitation"
    }
    </br>
    or get the email assosiated with the key by sending a query with url,
    eg- url - /auth/accept/?email=true,
    json - { "key": "key form invitation" }
    """

    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        key = request.data.get('key')

        Invitation = get_invitation_model()

        # Return email for the key
        if key and request.query_params.get('email'):
            invite = Invitation.objects.filter(key=key)
            if not invite:
                return Response({'detail': 'Invalid key'},
                                status=status.HTTP_400_BAD_REQUEST)
            invite = Invitation.objects.get(key=key)
            return Response({'email': invite.email},
                            status=status.HTTP_200_OK)

        if not key:
            return Response({'detail': 'Key field is required'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'detail': 'Email field is required'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'detail': 'Password field is required'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check invitation database
        invite = Invitation.objects.filter(key=key)
        if not invite:
            return Response({'detail': 'Invalid key'},
                            status=status.HTTP_400_BAD_REQUEST)
        invite = Invitation.objects.get(key=key)

        if email != invite.email:
            return Response({'detail': 'Invalid email'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the key is expired
        if key_expired(invite):
            return Response({'detail': 'Key expired'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check password validation
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'detail': e},
                            status=status.HTTP_400_BAD_REQUEST)

        # Create user
        serializer = RegisterSerializer(data={
            "email": email, "password1": password, "password2": password})

        if serializer.is_valid():
            user = serializer.save(request)
            create_token(TokenModel, user, serializer)
            data = TokenSerializer(user.auth_token).data

            # Mark invitation as accepted
            invite.accepted = True
            invite.save()
            return Response(data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def accept_invite(request, key):
    if request.method == 'GET':
        return Response({'detail': 'This page must implement on frontend'},
                        status=status.HTTP_400_BAD_REQUEST)
