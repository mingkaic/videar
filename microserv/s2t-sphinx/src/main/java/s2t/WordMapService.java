package s2t;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.SpeechResult;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;
import edu.cmu.sphinx.linguist.dictionary.Word;
import edu.cmu.sphinx.result.WordResult;
import edu.cmu.sphinx.util.LogMath;
import edu.cmu.sphinx.util.TimeFrame;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WordMapService {

    private StreamSpeechRecognizer transcriber;

    private double confidenceThreshold = 0.75;

    WordMapService() throws IOException {
        Configuration configuration = new Configuration();

        // Load model from the jar
        configuration.setAcousticModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us");
        configuration.setDictionaryPath("resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
        configuration.setLanguageModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin");

        this.transcriber = new StreamSpeechRecognizer(configuration);
    }

    public HashMap<String, List<TimeFrame> > process(InputStream transcriberStream) {
        System.out.println("starting to recognize");

        transcriber.startRecognition(transcriberStream);
        System.out.println("recognizing...");
        HashMap<String, List<TimeFrame> > wordMap = new HashMap<>();
        SpeechResult result;
        while ((result = transcriber.getResult()) != null) {
            System.out.println(result.toString());
            for (WordResult r : result.getWords()) {
                Word word = r.getWord();
                double confidence = LogMath.getLogMath().logToLinear((float)r.getConfidence());
                if (confidence >= confidenceThreshold && !r.isFiller() &&
                    !word.isSentenceStartWord() && !word.isSentenceEndWord()) {
                    String spelling = word.getSpelling();
                    TimeFrame tf = r.getTimeFrame();
                    List<TimeFrame> tfs;
                    System.out.println(spelling);
                    if (wordMap.containsKey(spelling)) {
                        tfs = wordMap.get(spelling);
                    } else {
                        tfs = new ArrayList<>();
                        wordMap.put(spelling, tfs);
                    }
                    tfs.add(tf);
                }
            }
        }
        System.out.println("Sphinx4 complete, stopping recognition");
        transcriber.stopRecognition();

        return wordMap;
    }

}
