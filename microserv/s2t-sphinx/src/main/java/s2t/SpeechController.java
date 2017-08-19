package s2t;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

import com.mongodb.gridfs.GridFSDBFile;
import edu.cmu.sphinx.util.TimeFrame;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
public class SpeechController {

    @Autowired
    GridFsTemplate gridFsTemplate;

    WordMapService wordMapService;

    SpeechController() {
        try {
            this.wordMapService = new WordMapService();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping("/vid_wordmap/{id}")
    public WordMapResponse getWordMap(@PathVariable(value="id") String id) {
        System.out.println(id);
        Query query = new Query();
        query.addCriteria(Criteria.where("filename").is(id));
        GridFSDBFile gridFSDBFile = gridFsTemplate.findOne(query);

        InputStream fstream = gridFSDBFile.getInputStream();
        HashMap<String, List<TimeFrame>> wMap = wordMapService.process(fstream);

        return new WordMapResponse(wMap);
    }

}
