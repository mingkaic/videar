package s2t;

import edu.cmu.sphinx.util.TimeFrame;

import java.util.HashMap;
import java.util.List;

public class WordMapResponse {

    private final HashMap<String, List<TimeFrame>> vidIds;

    public WordMapResponse(HashMap<String, List<TimeFrame>> wordMap) {
        this.vidIds = wordMap;
    }

    public HashMap<String, List<TimeFrame>> getVidIds() {
        return vidIds;
    }

}
