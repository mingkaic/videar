# Videar

The user provides a series of youtube links and a text "script."
The application extracts audio from uploaded audio files or youtube links
The application then synthesizes audio for the provided script using words from the set of youtube audio.
This application aims to facilitate content creators in making interesting clips from other audio assets.
The final product is an audio collage that conveys a unique message.

## Goals
Currently, this application only synthesizes audio from a given script. The next version should generate video.

## Checklist
[/] Upload audio files

[/] Construct a word map (from a speech model)
temporary speech2text: sphinx4
todo: upgrade to Rocnnet

[/] Construct best match from word map
room for improvement:
    - use more diverse matches (currently First Match First Serve)
once upgraded to Rocnnet:
    - match by syllables

[] Synthesize audio from best match

## Deployment
`docker-compose up` to run all services on host.
