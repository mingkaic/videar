package s2t;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.gridfs.GridFSDBFile;
import edu.cmu.sphinx.result.WordResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
public class SpeechController {

    @Autowired
    GridFsTemplate gridFsTemplate;

    TranscriptService transcriptService;

    SpeechController() {
        try {
            this.transcriptService = new TranscriptService();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/opstatus")
    public StatusResponse getStatus() {
        return new StatusResponse();
    }

    @RequestMapping("/transcribe/{id}")
    public TranscribeResponse getTranscript(@PathVariable(value="id") String id) {
        System.out.println("Received id " + id);
        Query query = new Query();
        query.addCriteria(Criteria.where("filename").is(id));
        String error = null;
        GridFSDBFile gridFSDBFile = gridFsTemplate.findOne(query);
        List<WordModel> subtitles;
        if (null != gridFSDBFile) {
            InputStream fstream = gridFSDBFile.getInputStream();
            try {
                subtitles = transcriptService.process(id, fstream);
            }
            catch (OutOfMemoryError e) {
                subtitles = new ArrayList<>();
                error = "sphinx4 resource limit";
            }
        }
        else {
            System.out.println("chunk not found: " + id);
            subtitles = new ArrayList<>();
            error = "chunk not found: " + id;
        }

        System.out.print("word map processing complete for " + id);
        if (null != error) {
            System.out.println(" ERROR: " + error);
        }
        else {
            System.out.println();
        }
        return new TranscribeResponse(subtitles, error);
    }

}
