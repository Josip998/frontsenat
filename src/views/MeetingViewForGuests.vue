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
    </div>

    <div class="points-container">
      <h2 style="padding-left: 10px">Agenda:</h2>
      <div
        v-for="(point, index) in meeting.points"
        :key="point.id"
        class="point"
      >
        <div class="point-details">
          <h3 style="font-size: 24px">{{ index + 1 }}. {{ point.title }}</h3>
          <p style="font-size: 20px">{{ point.details }}</p>

          <!-- Display Materials for Points -->
          <div class="point-materials">
            <h3>Documents:</h3>
            <ul>
              <li v-for="material in point.materials" :key="material.id">
                <a :href="material.document_url" target="_blank">{{
                  material.filename
                }}</a>
              </li>
            </ul>
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
                  <h4>Documents:</h4>
                  <ul>
                    <li
                      v-for="material in subpoint.materials"
                      :key="material.id"
                    >
                      <a :href="material.document_url" target="_blank">{{
                        material.filename
                      }}</a>
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
    getVirtualStatus(virtual) {
      return virtual === "True" ? "Yes" : "No";
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
  background-color: #e5e5e5e3;
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

.point {
  padding-left: 50px;
  color: #000000;
}

.subpoint {
  margin-left: 70px;
}

h3,
h4,
ul,
p {
  margin: 1px;
}

.points-container {
  padding: 30px;
}
</style>
