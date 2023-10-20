<template>
  <div class="meeting-view">
    <div class="meeting-header">
      <h1>{{ meeting.id }}. {{ meeting.title }}</h1>
      <p>{{ meeting.description }}</p>
      <br />
      <p>{{ formatTimeAndDate(meeting.start_time) }}</p>
    </div>

    <div class="meeting-details-container">
      <h2>Meeting Info</h2>
      <p>Location: {{ meeting.location }}</p>
      <p v-if="meeting.virtual">
        Link:
        <a :href="meeting.google_meet_link" target="_blank">{{
          meeting.google_meet_link
        }}</a>
      </p>
      <p>Date: {{ formatDate(meeting.start_time) }}</p>
      <p>Starts at: {{ formatTime(meeting.start_time) }}</p>
      <div class="button-div">
        <button @click="RedirectToOfficialLook(meeting.id)" class="look">
          Guests View
        </button>
        <button
          @click="RedirectToEditMeetingInfo(meeting.id)"
          class="edit-meeting"
        >
          Edit Meeting Info
        </button>
      </div>
      <hr />
    </div>

    <div class="points-container">
      <h2 style="padding-left: 10px">
        Agenda:
        <button
          class="add-points-button"
          @click="redirectToMeetingDetails(meeting.id)"
        >
          Add Points
        </button>
      </h2>
      <div
        v-for="(point, index) in meeting.points"
        :key="point.id"
        class="point"
      >
        <hr />
        <div class="point-details">
          <h3 style="font-size: 24px">
            {{ index + 1 }}. {{ point.title }}
            <button @click="editPoint(point.id)" class="edit-point">
              Edit Point
            </button>
          </h3>
          <p style="font-size: 20px">{{ point.details }}</p>

          <!-- Display Materials for Points -->
          <div class="point-materials">
            <h4>
              Documents:
              <button @click="editMaterials(point.id)" class="edit-materials">
                Edit Documents
              </button>
            </h4>
            <ul>
              <li v-for="material in point.materials" :key="material.id">
                <a :href="material.document_url" target="_blank">{{
                  material.filename
                }}</a>
              </li>
            </ul>
            <hr />
          </div>

          <!-- Display Subpoints for this Point -->
          <div class="subpoints">
            <div v-if="point.subpoints.length > 0">
              <div
                v-for="(subpoint, subIndex) in point.subpoints"
                :key="subpoint.id"
                class="subpoint"
              >
                <h3 style="font-size: 16px">
                  {{ index + 1 }}.{{ subIndex + 1 }} {{ subpoint.title }}
                </h3>
                <p>{{ subpoint.details }}</p>

                <!-- Display Materials for Subpoints -->
                <div class="subpoint-materials">
                  <h4>
                    Documents:
                    <button
                      @click="editMaterials(subpoint.id)"
                      class="edit-materials"
                    >
                      Edit Documents
                    </button>
                  </h4>
                  <ul>
                    <li
                      v-for="material in subpoint.materials"
                      :key="material.id"
                    >
                      <a :href="material.document_url" target="_blank">{{
                        material.filename
                      }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      meeting: {},
    };
  },
  methods: {
    RedirectToEditMeetingInfo(meetingId) {
      this.$router.push({ name: "EditMeetingInfo", params: { meetingId } });
    },
    RedirectToOfficialLook(meetingId) {
      this.$router.push({ name: "MeetingView", params: { meetingId } });
    },
    redirectToMeetingDetails(meetingId) {
      this.$router.push({ name: "MeetingDetails", params: { meetingId } });
    },
    editPoint(pointId) {
      this.$router.push({ name: "EditPoint", params: { pointId } });
    },
    editMaterials(pointId) {
      this.$router.push({ name: "EditMaterials", params: { pointId } });
    },
    formatTimeAndDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },
    formatTime(dateString) {
      const options = {
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },
  },
  created() {
    const meetingId = this.$route.params.meetingId;

    // Fetch meeting details
    axios
      .get(`/api/meetings/${meetingId}`) // Adjust the URL as needed
      .then((response) => {
        this.meeting = response.data;
        console.log(response.data);
        // Fetch the points associated with the meeting
        axios
          .get(`/api/meetings/${meetingId}/top-level-points`) // Adjust the URL as needed
          .then((pointsResponse) => {
            // Assign the fetched points to the meeting object
            this.meeting.points = pointsResponse.data;
          })
          .catch((pointsError) => {
            console.error(
              "Error fetching meeting top level points:",
              pointsError
            );
          });
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
      });
  },
};
</script>

<style scoped>
.meeting-view {
  background-color: #e5e5e5cf;
  border: 1px solid;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 20px auto;
  padding: 10px;
}

.meeting-header {
  text-align: center;
  background-color: #0b51f5a8;
  color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}

.meeting-details-container {
  margin-bottom: 20px;
  text-align: center;
}

.points-container h2 {
  font-size: 18px;
}

.points-container {
  padding: 20px;
}

.point {
  margin-top: 3px;
  padding-left: 50px;
  padding-top: 10px;
  color: #000000;
}

.subpoint {
  margin-left: 100px;
  padding: 5px;
}

.edit-point {
  background-color: rgb(92, 137, 233);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.edit-point:hover {
  background-color: #1421da; /* Change to a different shade of red on hover */
}

.edit-meeting {
  background-color: rgb(92, 137, 233);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-left: 10px;
}

.edit-meeting:hover {
  background-color: #1421da; /* Change to a different shade of red on hover */
}

.look {
  background-color: rgb(194, 92, 223);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-left: 20px;
}

.look:hover {
  background-color: #8e11d1; /* Change to a different shade of red on hover */
}

.edit-materials {
  background-color: rgb(207, 160, 40);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.edit-materials:hover {
  background-color: #a87e0a; /* Change to a different shade of red on hover */
}

.add-points-button {
  background-color: rgb(62, 206, 46);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.add-points-button:hover {
  background-color: #0a8a01; /* Change to a different shade of red on hover */
}

.button-div {
  display: flex;
}
</style>
