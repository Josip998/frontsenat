<template>
  <div class="meeting">
    <h2>Dodaj novu sjednicu:</h2>
    <form @submit.prevent="saveMeeting">
      <div class="form-group">
        <label for="title">Naslov*:</label>
        <input
          type="text"
          v-model="meetingName"
          :readonly="isSaved"
          placeholder="Naslov sjednice"
        />
      </div>
      <div class="form-group">
        <label for="title">Datum i vrijeme početka*:</label>
        <input
          type="datetime-local"
          v-model="startDateTime"
          :readonly="isSaved"
          lang="hr-HR"
        />
      </div>
      <div class="form-group">
        <label for="title">Opis:</label>
        <input
          type="text"
          v-model="description"
          :readonly="isSaved"
          placeholder="Opis (nije obavezno)"
        />
      </div>
      <div class="form-group">
        <label for="title">Lokacija</label>
        <input
          type="text"
          v-model="location"
          :readonly="isSaved"
          placeholder="Lokacija (nije obavezno)"
        />
      </div>
      <div class="form-group">
        <label for="title">Online sjednica:</label>
        <input
          type="checkbox"
          v-model="virtual"
          :readonly="isSaved"
          class="custom-checkbox"
        />
      </div>
      <div class="form-group" v-if="virtual">
        <label for="title">Google meet link:</label>
        <input
          type="text"
          v-model="googleMeetLink"
          :readonly="isSaved"
          placeholder="npr: https://meet.google.com/amt-rttu-amx"
        />
      </div>
      <button @click="saveData" class="save-button" v-if="!isSaved">
        Spremi
      </button>
    </form>
    <div v-if="showValidationWarning" class="validation-warning">
      Molimo te ispuni obavezna polja * (Naslov, Datum i vrijeme početka).
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      meetings: [],
      meetingName: "",
      startDateTime: "",
      description: "",
      location: "",
      virtual: false,
      googleMeetLink: "https://",
      isSaved: false,
      showValidationWarning: false,
    };
  },
  methods: {
    saveData() {
      if (!this.googleMeetLink) {
        this.googleMeetLink = "https://meet.google.com/"; // Default URL
      }
      if (!this.meetingName || !this.startDateTime) {
        // Check if required fields are empty
        this.showValidationWarning = true;
        return; // Prevent the form from being submitted
      }

      const newMeeting = {
        title: this.meetingName,
        start_time: this.startDateTime,
        description: this.description,
        location: this.location,
        virtual: this.virtual,
        google_meet_link: this.googleMeetLink,
      };

      axios
        .post("/api/meetings", newMeeting)
        .then((response) => {
          // Handle a successful response, e.g., show a success message
          console.log(response.data);
          this.isSaved = true;

          // Prepend the new meeting data to the meetings array
          this.meetings.unshift(response.data);

          // Redirect to the meetings list page
          this.$router.push({ name: "Meetings" });
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.validation-warning {
  color: red;
  margin: 20px;
}
.meeting {
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
