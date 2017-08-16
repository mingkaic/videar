package s2t;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "videos")
public class Audio {

    @Id
    public String id;

    public String vidId;
    public String source;
    public Date updated;
    public Date lastAccess;

    Audio() {}

    Audio(String vidId) {
        this(vidId, "uploaded");
    }

    Audio(String vidId, String source) {
        this.vidId = vidId;
        this.source = source;
        this.updated = new Date();
        this.lastAccess = new Date();
    }

    @Override
    public String toString() {
        return String.format("Audio[vidId=%s, source=%s]", vidId, source);
    }

}
