package s2t;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.SpeechResult;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;
import edu.cmu.sphinx.result.WordResult;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class WordMapService {

    private StreamSpeechRecognizer transcriber;

    WordMapService() throws IOException {

        Configuration configuration = new Configuration();

        // Load model from the jar
        configuration.setAcousticModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us");
        configuration.setDictionaryPath("resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
        configuration.setLanguageModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin");

        this.transcriber = new StreamSpeechRecognizer(configuration);
    }

    public ArrayList<String> process(InputStream transcriberStream) {
        transcriber.startRecognition(transcriberStream);
        List<WordResult> results = new ArrayList<>();
        SpeechResult result;
        while ((result = transcriber.getResult()) != null) {

            System.out.format("Hypothesis: %s\n", result.getHypothesis());

            System.out.println("List of recognized words and their times:");
            for (WordResult r : result.getWords()) {
                System.out.println(r);
                results.add(r);
            }

            System.out.println("Best 3 hypothesis:");
            for (String s : result.getNbest(3))
                System.out.println(s);

        }
        transcriber.stopRecognition();

        return wordMap(results);
    }

    private ArrayList<String> wordMap(List<WordResult> results) {
        ArrayList<String> out = new ArrayList<>();
        for (WordResult res : results) {
            out.add(res.toString());
        }
        return out;
    }

}
