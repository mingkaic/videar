package s2t;

import java.util.ArrayList;

public class WordMapResponse {

    private final ArrayList<String> vidIds;

    public WordMapResponse(ArrayList<String> vidIds) {
        this.vidIds = vidIds;
    }

    public ArrayList<String> getVidIds() {
        return vidIds;
    }

}
