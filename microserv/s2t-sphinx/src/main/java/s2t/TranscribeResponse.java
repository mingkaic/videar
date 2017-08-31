package s2t;

import java.util.List;

public class TranscribeResponse {

    private final List<WordModel> subtitles;
    private final String error;

    public TranscribeResponse(List<WordModel> wordMap, String error) {
        this.subtitles = wordMap;
        this.error = error;
    }

    public List<WordModel> getSubtitles() {
        return subtitles;
    }

}
