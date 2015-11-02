function ScheduleItem(slot, speakerUrlLookup) {
    this.id = slot.talk.id;
    this.type = slot.talk.kind;
    this.room = getRoom(slot.roomName);
    if (this.room.length == 1) {
        this.roomPadded = '0' + this.room;
    } else {
        this.roomPadded = this.room;
    }
    this.day = slot.day;
    this.dayNr = getDayNr(slot.day);
    this.time = slot.fromTime;
    //this.speakerId = slot.talk.speakers && slot.talk.speakers.length > 0 && slot.talk.speakers[0].speakerId;
    this.speakers = getSpeakerNames(slot.talk.speakers);
    //this.speakerImgUrl = getSpeakerImage(this.speakerId);
    this.title = slot.talk.title;

    /**
     * Return the Speaker Image URL based on the ID from the SpeakerURI property in the JSON response.
     * @param speakerUri SpeakerURI
     */
    function getSpeakerImage(speakerId) {
        return speakerUrlLookup(speakerId);
    }

    function getDayNr(day) {
        switch (day) {
            case 'sunday':    return 0;
            case 'monday':    return 1;
            case 'tuesday':   return 2;
            case 'wednesday': return 3;
            case 'thursday':  return 4;
            case 'friday':    return 5;
            case 'saturday':  return 6;
            default:          return 0; //Should never happen
        }
    }

    //function getTime(time) {
    //    return getDate(time).toString("HH:mm");
    //}

    //function getDate(time) {
    //    return Date.parseExact(time, "yyyy-MM-dd HH:mm:ss.0");
    //}

    //function getDay(time) {
    //    return day(getDate(time));
    //}

    function getRoom(room) {
        return room.replace(/(Room |(B)OF )(\d+)/i, "$2$3"); // Only number for room or B prefix for BOF rooms
    }

    function getSpeakerNames(speakers) {

        if (!speakers) return "N/A";

        var speakerNames = _.uniq(_.pluck(speakers, "name")).join(", ");

        return  speakerNames;
    }

}

function Speaker(speakerItem) {

    this.id = speakerItem.uuid;
    this.name = speakerItem.firstName + ' ' + speakerItem.lastName;
    this.imageUrl = speakerItem.avatarURL;

    this.toString = function() { return this.imageUrl; }

}

function Tweet(tweet) {

    this.id = tweet.id;
    this.author = tweet.from;
    this.image = tweet.profileImageUrl;
    this.tweet = tweet.message;
    this.createdAt = tweet.timestamp;

    this.toString = function() {
        return this.author + " " + this.id;
    }
}