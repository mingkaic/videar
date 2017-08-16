package s2t;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface AudioRepository extends MongoRepository<Audio, String> {

    public Audio findByVidId(String vidId);

}
