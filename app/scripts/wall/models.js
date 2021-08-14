'use strict';
/* exported ScheduleItem */

/* exported Speaker */
function ScheduleItem(talk) {
    this.id = talk.id;
    this.type = talk.sessionTypeName;
    this.room = getRoom(talk.roomName);
    this.time = new Date(talk.fromDate);
    this.speakers = getSpeakerNames(talk.speakers);
    this.title = talk.talkTitle;
    this.dayNr = this.time.getDay();
    this.day = getDay(this.dayNr);

    function getDay(day) {
        switch (day) {
            case 0:
                return 'sunday';
            case 1:
                return 'monday';
            case 2:
                return 'tuesday';
            case 3:
                return 'wednesday';
            case 4:
                return 'thursday';
            case 5:
                return 'friday';
            case 6:
                return 'saturday';
            default:
                return 'sunday'; //Should never happen
        }
    }

    function getRoom(room) {
        var r = room.replace(/(Room |(B)OF )(\d+)/i, '$2$3'); // Only number for room or B prefix for BOF rooms
        var pad = '      '; // many spaces to preserve numerical order when ordering alphabetically
        return pad.substring(0, pad.length - r.length) + r;
    }

    function getSpeakerNames(speakers) {

        speakers = speakers.map(function (s) {
            return new Speaker(s);
        });

        if (!speakers) {
            return 'N/A';
        }

        var speakerNames = _.uniq(_.pluck(speakers, 'name')).join(', ');

        return speakerNames;
    }

}

function Speaker(speakerItem) {

    this.id = speakerItem.id;
    this.name = speakerItem.firstName + ' ' + speakerItem.lastName;
    this.imageUrl = '';

    this.toString = function () {
        return this.imageUrl;
    };

}
