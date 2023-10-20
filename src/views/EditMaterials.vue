<template>
  <div class="outher">
    <div class="edit">
      <h2>{{ point.point.title }}</h2>
      <h3>{{ point.point.details }}</h3>
      <!-- List of Materials -->
      <ul>
        <li v-for="(material, index) in point.point.materials" :key="index">
            <button @click="deleteMaterial(material.id)" class="delete-button">
            Delete
          </button>
          <a :href="material.document_url" target="_blank">{{
            material.filename
          }}</a>
  
        </li>
      </ul>

      <!-- File Input for Uploading New Materials -->
      <h3>Add Material:</h3>
      <input
        type="file"
        name="file"
        @change="uploadNewMaterials"
        ref="fileInput"
      />
    <button @click="RedirectBack(point.point.meeting_id)" class="edit-points-button">Go Back</button>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    pointId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      point: {
        title: "",
        details: "",
        materials: [], // Store the list of materials for the point
      },
    };
  },
  methods: {
    RedirectBack(meetingId) {
      this.$router.push({ name: "EditMeetingDetails", params: { meetingId } });
    },
    getPointDetails() {
      // Fetch the point details, including its materials, by pointId
      axios
        .get(`/api/points/${this.pointId}`)
        .then((response) => {
          this.point = response.data;
        })
        .catch((error) => {
          console.error("Error fetching point details:", error);
        });
    },
    uploadNewMaterials(event) {
      const files = event.target.files;
      if (files.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append("file", files[i]);
        }

        // Send a POST request to upload the new materials
        axios
          .post(
            `/api/points/${this.point.point.id}/upload-material`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            // Handle the response, e.g., show a success message
            console.log("Materials uploaded:", response.data);
            // Add a delay before resetting the input file
            setTimeout(() => {
              this.$refs.fileInput.value = ""; // Reset the file input
            }, 500); // Delay for 0.5 seconds (500 milliseconds)
            // Refresh the materials list to display the new materials
            this.getPointDetails();
          })
          .catch((error) => {
            // Handle errors, e.g., show an error message
            console.error("Error uploading materials:", error);
          });
      }
    },
    deleteMaterial(materialId) {
      // Send a DELETE request to delete the material by ID
      axios
        .delete(`/api/materials/${materialId}`)
        .then((response) => {
          // Handle the response, e.g., show a success message
          console.log("Material deleted:", response.data);
          // Refresh the materials list to reflect the deletion
          this.getPointDetails();
        })
        .catch((error) => {
          // Handle errors, e.g., show an error message
          console.error("Error deleting material:", error);
          // Refresh the materials list to reflect the deletion
          this.getPointDetails();
        });
    },
  },
  created() {
    // Load point details, including materials, when the component is created
    this.getPointDetails();
  },
};
</script>

<style scoped>
.edit {
  margin: 200px auto;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center children horizontally */
  justify-content: center; /* Center children vertically */
  min-height: 50vh; /* Minimum height to center vertically */
  background-color: rgba(255, 255, 255, 0.722);
  border: 1px solid #e0e0e0;
  color: #000000;
  width: 30%;
}


input {
  margin-left: 95px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.delete-button {
  background-color: rgb(233, 92, 92);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin-right: 10px;
  margin-top: 15px;
}

.delete-button:hover {
  background-color: #ba0000; /* Change to a different shade of red on hover */
}

.edit-points-button {
  background-color: rgb(92, 137, 233);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 15px;
  cursor: pointer;
  transition: background-color 0.1s ease-in-out;
  margin: 20px auto;
}

.edit-points-button:hover {
  background-color: #1421da; /* Change to a different shade of red on hover */
}
</style>
