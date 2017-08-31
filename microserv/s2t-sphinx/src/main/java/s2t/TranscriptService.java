package s2t;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.SpeechResult;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;
import edu.cmu.sphinx.linguist.dictionary.Word;
import edu.cmu.sphinx.result.WordResult;
import edu.cmu.sphinx.util.LogMath;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class TranscriptService {

    private StreamSpeechRecognizer transcriber;
    private Configuration configuration;

    private double confidenceThreshold = 0.75;

    TranscriptService() throws IOException {
        configuration = new Configuration();

        // Load model from the jar
        configuration.setAcousticModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us");
        configuration.setDictionaryPath("resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
        configuration.setLanguageModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin");
        
        transcriber = new StreamSpeechRecognizer(configuration);
    }

    public List<WordModel> process(String id, InputStream transcriberStream)  {
        System.out.println("starting to recognize request " + id);
        transcriber.startRecognition(transcriberStream);
        System.out.println("recognizing...");
        List<WordModel> transcript = new ArrayList<>();
        SpeechResult result;
        while ((result = transcriber.getResult()) != null) {
            for (WordResult r : result.getWords()) {
                System.out.println(r.toString());
                Word word = r.getWord();
                double confidence = LogMath.getLogMath().logToLinear((float)r.getConfidence());
                if (confidence >= confidenceThreshold && !r.isFiller() &&
                        !word.isSentenceStartWord() && !word.isSentenceEndWord()) {
                    transcript.add(new WordModel(r));
                }
            }
        }
        System.out.println("Sphinx4 complete, stopping recognition");
        transcriber.stopRecognition();

        return transcript;
    }

}
