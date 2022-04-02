# transcript/views.py

import json
from asgiref.sync import async_to_sync

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.conf import settings

from deepgram import Deepgram


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def index(request):
    """Deepgrapm AI api request"""
    file = request.data.get('audio')
    mimetype = request.data.get('mimetype')
    audio = open(file.temporary_file_path(), 'rb')

    deepgram = Deepgram(settings.DEEPGRAM_API_KEY)

    # hello.delay()

    source = {
        'buffer': audio,
        'mimetype': mimetype
    }

    response = async_to_sync(deepgram.transcription.prerecorded)(
        source,
        {
            'punctuate': True,
        }
    )
    # print(json.dumps(response, indent=4))
    transcript = response['results']['channels'][0]['alternatives'][0]['transcript']

    return Response(data={'transcript': transcript}, status=status.HTTP_200_OK)
