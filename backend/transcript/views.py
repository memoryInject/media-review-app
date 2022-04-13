# transcript/views.py

import json
import time
import logging

from asgiref.sync import async_to_sync

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.conf import settings

from deepgram import Deepgram

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def index(request):
    """Deepgrapm AI api request"""
    # Remove the InMemoryHandler
    # https://stackoverflow.com/questions/6906935/
    # problem-accessing-user-uploaded-video-in-temporary-memory
    request.upload_handlers.pop(0)
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
    logger.info(logger.name)
    logger.debug(json.dumps(response, indent=4))
    transcript = response['results']['channels'][0]['alternatives'][0]['transcript']

    return Response(data={'transcript': transcript}, status=status.HTTP_200_OK)


# For testing
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def dummy_index(request):
    mimetype = request.data.get('mimetype')
    logger.debug([logger.name, mimetype])
    time.sleep(1)
    # return Response(data={'transcript': 'hello world'},
    # status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(data={'transcript': 'Make it less saturated.'},
                    status=status.HTTP_200_OK)
