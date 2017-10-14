# Videar

The user provides a series of youtube links and a text "script."
From uploaded audio assets, the application attempts to concatenate audio words that best match the script.
This application aims to help content creators convey a message using existing audio.

Disclaimer: the speech2text performance is currently poor, please use the provided audio for the best synthesis results

## Goals
Currently, this application only synthesizes audio from a given script. The next version should generate video.

## Checklist
[] search selectable audio functionality

[] Search available subtitle tokens (in all processed audio files [intensive] or within the selected set)

[] Save & Download Synthesized audios

[] upload and synthesis notification using server-sent events

## Deployment
`docker-compose up` to run all services on host.
