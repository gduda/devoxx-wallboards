'use strict';
/* exported ScheduleItem */
/* exported Speaker */
function ScheduleItem(slot) {
    this.id = slot.talk.id;
    this.type = slot.talk.kind;
    this.room = getRoom(slot.roomName);
    this.day = slot.day;
    this.dayNr = getDayNr(slot.day);
    this.time = slot.fromTime;
    this.speakers = getSpeakerNames(slot.talk.speakers);
    this.title = slot.talk.title;

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

    function getRoom(room) {
        var r = room.replace(/(Room |(B)OF )(\d+)/i, '$2$3'); // Only number for room or B prefix for BOF rooms
		var pad = '      '; // many spaces to preserve numerical order when ordering alphabetically
		return pad.substring(0, pad.length - r.length) + r;
    }

    function getSpeakerNames(speakers) {

        if (!speakers) {
            return 'N/A';
        }

        var speakerNames = _.uniq(_.pluck(speakers, 'name')).join(', ');

        return  speakerNames;
    }

}

function Speaker(speakerItem) {

    this.id = speakerItem.uuid;
    this.name = speakerItem.firstName + ' ' + speakerItem.lastName;
    this.imageUrl = speakerItem.avatarURL;

    this.toString = function() {
        return this.imageUrl;
    };

}
