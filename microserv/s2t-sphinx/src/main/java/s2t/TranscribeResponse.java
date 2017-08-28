package s2t;

import java.util.List;

public class TranscribeResponse {

    private final List<WordModel> subtitles;

    public TranscribeResponse(List<WordModel> wordMap) {
        this.subtitles = wordMap;
    }

    public List<WordModel> getSubtitles() {
        return subtitles;
    }

}
