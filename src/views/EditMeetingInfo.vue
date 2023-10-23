<template>
  <div class="meeting-info">
    <h2>Uredi detalje sjednice:</h2>
    <form @submit.prevent="saveMeeting">
      <div class="form-group">
        <label for="title">Naslov:</label>
        <input type="text" id="title" v-model="meeting.title" required />
      </div>
      <div class="form-group">
        <label for="description">Opis:</label>
        <textarea id="description" v-model="meeting.description"></textarea>
      </div>
      <div class="form-group">
        <label for="start_time">Datum i vrijeme početka:</label>
        <input
          type="datetime-local"
          id="start_time"
          v-model="meeting.start_time"
          lang="hr-HR"
          required
        />
      </div>
      <div class="form-group">
        <label for="location">Lokacija:</label>
        <input type="text" id="location" v-model="meeting.location" />
      </div>
      <div class="form-group">
        <label for="virtual">Online sjednica:</label>
        <input
          type="checkbox"
          id="virtual"
          v-model="meeting.virtual"
          class="custom-checkbox"
        />
      </div>
      <div class="form-group" v-if="meeting.virtual">
        <label for="google_meet_link">Google meet link:</label>
        <input
          type="text"
          id="google_meet_link"
          v-model="meeting.google_meet_link"
          placeholder="npr: https://meet.google.com/amt-rttu-amx"
        />
      </div>
      <button @click="saveMeeting" class="save-button">Spremi</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      meeting: {
        title: "",
        description: "",
        start_time: "",
        location: "",
        virtual: false,
        google_meet_link: "https://",
      },
    };
  },
  methods: {
    saveMeeting() {
      if (!this.meeting.google_meet_link) {
        this.meeting.google_meet_link = "https://meet.google.com/"; // Default URL
      }
      // Send a PUT request to update the meeting details
      axios
        .put(`/api/meetings/${this.meeting.id}`, this.meeting)
        .then((response) => {
          console.log("Meeting updated:", response.data);
          // Redirect to the meeting details page or another appropriate route
          this.$router.push({
            name: "EditMeetingDetails",
            params: { id: this.meeting.id },
          });
        })
        .catch((error) => {
          console.error("Error updating meeting:", error);
        });
    },
  },
  created() {
    // Fetch the meeting details to populate the form
    const meetingId = this.$route.params.meetingId;
    axios
      .get(`/api/meetings/${meetingId}`)
      .then((response) => {
        // Format the start_time value before assigning it
        this.meeting = {
          ...response.data,
          start_time: new Date(response.data.start_time)
            .toISOString()
            .slice(0, 16),
        };
      })
      .catch((error) => {
        console.error("Error fetching meeting details:", error);
      });
  },
};
</script>

<style scoped>
.meeting-info {
  font-family: Arial, sans-serif;
  margin: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background-color: rgba(255, 255, 255, 0.77);
  color: #000000;
  width: 30%;
}

.form-group {
  margin: 10px 0;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="datetime-local"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-top: 5px;
}

.save-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 20px 120px;
}

.save-button:hover {
  background-color: #0056b3;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
}
</style>
