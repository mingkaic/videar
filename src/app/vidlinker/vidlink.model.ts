enum linkStatus {
    unprocessed = 0,
    processing,
    processed,
    rejected
};

const linkString: string[] = ["unprocessed", "processing", "processed", "rejected"];
const utubeReg = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

export class VidLinkModel {
    link: string = "";
    private status: linkStatus = linkStatus.unprocessed;

    constructor() {};

    getStatus() : string {
        return linkString[this.status];
    }

    processLink() {
        this.status = linkStatus.processing;
        Promise.resolve(this.link)
        .then((link) => {
            if (utubeReg.test(link)) {
                let vidId = utubeReg.exec(link)[1];
                console.log(vidId);
                this.status = linkStatus.processed;
            }
            else {
                this.status = linkStatus.rejected;
            }
        })
        .catch((err) => {
            console.log(err);
            this.status = linkStatus.rejected;
        });
    }
};