# Videar

The user provides a series of youtube links and a text "script."
From uploaded audio assets, the application attempts to concatenate audio words that best match the script.
This application aims to help content creators convey a message using existing audio.

Disclaimer: the speech2text performance is currently poor, please use the provided audio for the best synthesis results

## Goals
Currently, this application only synthesizes audio from a given script. The next version should generate video.

## Checklist
[/] Construct a word map (from a speech model)
temporary speech2text: sphinx4
todo: upgrade to Rocnnet

[/] Construct best match from word map
room for improvement:
    - use more diverse matches (currently First Match First Serve)
once upgraded to Rocnnet:
    - match by syllables

[] Visualize available monologues from videos

[] Save & Download Synthesized audios

## Deployment
`docker-compose up` to run all services on host.
