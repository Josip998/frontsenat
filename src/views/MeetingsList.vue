<template>
  <div class="meeting-list-container">
    <router-link :to="{ name: 'New Meeting' }">
      <button class="add-meeting-button">+</button>
    </router-link>
    <div v-for="meeting in meetings" :key="meeting.id" class="meeting-box">
      <div class="buttons">
        <button
          v-if="!hasPoints(meeting)"
          class="add-points-button"
          @click="redirectToMeetingDetails(meeting.id)"
        >
          Add Points
        </button>
        <button
          v-else
          class="edit-points-button"
          @click="redirectToEditMeetingDetails(meeting.id)"
        >
          Edit Meeting
        </button>
        <button
          @click="deleteMeeting(meeting.id)"
          class="delete-meeting-button"
        >
          Delete Meeting
        </button>
      </div>
      <h3>{{ meeting.id }}. {{ meeting.title }}</h3>
      <p>{{ formatDate(meeting.start_time) }}</p>
      <!-- Conditionally render the "Add Points" button -->
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      meetings: [],
    };
  },
  methods: {
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    redirectToMeetingDetails(meetingId) {
      this.$router.push({ name: "MeetingDetails", params: { meetingId } });
    },
    redirectToEditMeetingDetails(meetingId) {
      this.$router.push({ name: "EditMeetingDetails", params: { meetingId } });
    },
    deleteMeeting(meetingId) {
      if (confirm("Are you sure you want to delete this meeting?")) {
        axios
          .delete(`/api/meetings/${meetingId}`)
          .then((response) => {
            this.meetings = this.meetings.filter(
              (meeting) => meeting.id !== meetingId
            );
          })
          .catch((error) => {
            console.error("Error deleting meeting:", error);
          });
      }
    },
    // Check if the meeting has points
    hasPoints(meeting) {
      return meeting.points && meeting.points.length > 0;
    },
    fetchPointsForMeetings() {
      // Fetch points for each meeting and update the `meetings` data
      this.meetings.forEach((meeting) => {
        axios
          .get(`/api/meetings/${meeting.id}/top-level-points`)
          .then((pointsResponse) => {
            // Assign the fetched points to the meeting object
            meeting.points = pointsResponse.data;
          })
          .catch((pointsError) => {
            console.error(
              "Error fetching meeting top level points:",
              pointsError
            );
          });
      });
    },
  },
  mounted() {
    axios
      .get("/api/meetings")
      .then((response) => {
        this.meetings = response.data;
        // Fetch points for meetings
        this.fetchPointsForMeetings();
      })
      .catch((error) => {
        console.error("Error fetching meetings:", error);
      });
  },
};
</script>

<style scoped>
.meeting-list-container {
  font-family: Arial, sans-serif;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally */
  justify-content: center; /* Center children vertically */
  min-height: 60vh; /* Minimum height to center vertically */
  color: #141212;
  width: 30%;
}

.meeting-box {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background-color: #ffffffd1;
  text-align: center;
  width: 300px;
  cursor: pointer;
  transition: transform 0.2s; /* Add a transition to the 'transform' property */

  /* Apply the zoom effect on hover */
  &:hover {
    transform: scale(1.1); /* Adjust the scale factor as needed */
  }
}

.add-meeting-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5em;
  margin: 20px;
  cursor: pointer;
}

.add-meeting-button:hover {
  background-color: #0056b3;
}

.delete-meeting-button {
  background-color: rgb(226, 112, 112);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 90px;
  transition: background-color 0.1s ease-in-out;
}

.delete-meeting-button:hover {
  background-color: #ff0000; /* Change to a different shade of red on hover */
}

.edit-points-button {
  background-color: rgb(92, 137, 233);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.edit-points-button:hover {
  background-color: #1421da; /* Change to a different shade of red on hover */
}

.add-points-button {
  background-color: rgb(64, 213, 64);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
}

.add-points-button:hover {
  background-color: #016624; /* Change to a different shade of red on hover */
}

.buttons {
  display: flex;
  gap: 5px; /* Adjust the gap as needed */
}
</style>
