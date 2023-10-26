<template>
  <div class="meeting-view">
    <div class="meeting-header">
      <h1>{{ meeting.title }}</h1>
      <p style="font-size: 24px; font-family: 'Times New Roman', Times, serif;">{{ meeting.location }}, {{ formatDate(meeting.start_time) }} u {{ formatTime(meeting.start_time) }}</p>

      <p v-if="meeting.virtual">
        Poveznica:
        <a :href="meeting.google_meet_link" target="_blank" class="google-link">{{
          meeting.google_meet_link
        }}</a>
      </p>
    </div>


    <div class="points-container">
      <h1 style="padding-left: 10px">Dnevni red:</h1>
      <div
        v-for="(point, index) in meeting.points"
        :key="point.id"
        class="point"
      >
        <div class="point-details">
          <h3 style="font-size: 24px; margin-top: 20px">
            {{ index + 1 }}. {{ point.title }}
          </h3>
          <p style="font-size: 20px">{{ point.details }}</p>

          <!-- Display Materials for Points -->
          <div class="point-materials">
            <h3>Dokumenti:</h3>
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
                <h3 style="font-size: 16px; margin-top: 10px">
                  {{ index + 1 }}.{{ subIndex + 1 }} {{ subpoint.title }}
                </h3>
                <p>{{ subpoint.details }}</p>

                <!-- Display Materials for Subpoints -->
                <div class="subpoint-materials">
                  <h4>Dokumenti:</h4>
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
    formatTimeAndDate(dateString, timeZone) {
      const date = new Date(dateString);

      if (timeZone) {
        date.setTimezoneOffset(timeZone * 60); // Postavi vremensku zonu u minutama
      }

      const optionsDate = {
        year: "numeric",
        month: "short", // "short" za kratak oblik, "long" za dugi oblik
        day: "numeric",
      };
      const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours in 2-digit format
      const minutes = date.getUTCMinutes().toString().padStart(2, "0"); // Get minutes in 2-digit format

      const formattedDate = date.toLocaleString("hr-HR", optionsDate);
      return `${formattedDate} ${hours}:${minutes}h`;
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long", // "short" za kratak oblik, "long" za dugi oblik
        day: "numeric",
      };
      return new Date(dateString).toLocaleString("hr-HR", options);
    },
    formatTime(dateString, timeZone) {
      const date = new Date(dateString);

      if (timeZone) {
        date.setTimezoneOffset(timeZone * 60); // Postavi vremensku zonu u minutama
      }

      const hours = date.getUTCHours().toString().padStart(2, "0"); // Get hours in 2-digit format
      const minutes = date.getUTCMinutes().toString().padStart(2, "0"); // Get minutes in 2-digit format

      return `${hours}:${minutes}h`;
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
  background-color: #ffffffec;
  background-image: url('/src/assets/images/textured-paper.png');
  border: 1px solid;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 20px auto;
  padding: 10px;
  font-family: 'Times New Roman', Times, serif;
}

.meeting-header {
  text-align: center;
  background-color: #00427bee;
  color: #fff;
  padding: 10px;
  margin-bottom: 20px;
}

.meeting-details-container {
  margin-bottom: 20px;
  text-align: left;
  margin: auto;
  width: fit-content;
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

.google-link{
  color: rgb(216, 153, 98);
}

.google-link:visited {
  color: rgb(207, 105, 4);
}
.points-container {
  padding: 30px;
}
</style>
