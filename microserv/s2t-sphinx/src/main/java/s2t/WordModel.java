package s2t;

import edu.cmu.sphinx.result.WordResult;
import edu.cmu.sphinx.util.TimeFrame;

public class WordModel {

    private String word;
    private TimeFrame time;

    WordModel(WordResult result) {
        word = result.getWord().toString();
        time = result.getTimeFrame();
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public TimeFrame getTime() {
        return time;
    }

    public void setTime(TimeFrame time) {
        this.time = time;
    }

}
