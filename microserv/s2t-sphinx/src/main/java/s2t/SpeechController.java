package s2t;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.*;
import com.mongodb.gridfs.GridFSDBFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
public class SpeechController {

    @Autowired
    AudioRepository audioRepository;

    @Autowired
    GridFsTemplate gridFsTemplate;

    WordMapService wordMapService;

    public JsonParser jsonParser;

    SpeechController() {
        this.jsonParser = new JsonParser();
        try {
            this.wordMapService = new WordMapService();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(method = RequestMethod.GET, value = "/vid_wordmap")
    public WordMapResponse getWordMap(@Valid @RequestBody String params) {
        String jsonStr = bodyParse(params);
        JsonObject jsonObj = jsonParser.parse(jsonStr).getAsJsonObject();
        JsonArray vidIds = jsonObj.getAsJsonArray("vidIds");

        ArrayList<String> dataEl = new ArrayList<>();
        // verify ids exist on mongo
        for (int i = 0; i < vidIds.size(); i++) {
            String vId = vidIds.get(i).getAsString();
            GridFSDBFile gridFSDBFile = mongoRetreive(vId);

            InputStream gfsStream = gridFSDBFile.getInputStream();
            ArrayList<String> wMap = wordMapService.process(gfsStream);
            dataEl.addAll(wMap);
        }
        return new WordMapResponse(dataEl);
    }

    private String bodyParse(String body) {
        Pattern pattern = Pattern.compile("\\%([\\dA-F][\\dA-F])");
        Matcher matcher = pattern.matcher(body.replace('=', ':'));
        StringBuffer buffer = new StringBuffer();
        buffer.append('{');
        while (matcher.find()) {
            String hex = matcher.group(1);
            char replacement = (char) Integer.parseInt(hex,16);
            matcher.appendReplacement(buffer, "");
            buffer.append(replacement);
        }
        matcher.appendTail(buffer);
        buffer.append('}');
        return buffer.toString();
    }

    private GridFSDBFile mongoRetreive(String id) {
        Audio audio = audioRepository.findByVidId(id);
        if (null != audio) {
            Query query = new Query();
            query.addCriteria(Criteria.where("filename").is(id));
            return gridFsTemplate.findOne(query);
        }
        return null;
    }

}
