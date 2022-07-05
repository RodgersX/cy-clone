<template>
  <v-app>
    <header app flat dark class="header d-flex justify-space-between">
      <v-app-bar-title>
        <h2 class="green--text">CyWeather</h2>
      </v-app-bar-title>
      <v-spacer />
      <v-btn outlined color="green" class="hidden-sm-and-down"
        >About CyWeather</v-btn
      >
    </header>

    <main class="main-app">
      <section class="form-div">
        <h2 class="mb-10">
          Enter the longitude and Latitude to get the weather
        </h2>
        <form>
          <v-text-field
            label="Latitude"
            color="green"
            v-model="latitude"
            class="input-field"
          >
          </v-text-field>
          <v-text-field
            label="Longitude"
            color="green"
            v-model="longitude"
            class="input-field green--text"
          >
          </v-text-field>
          <v-btn
            depressed
            @click.prevent="getWeatherData"
            @keyup.enter="getWeatherData"
            block
            color="green darken-2"
            class="mt-6 white--text"
          >
            Submit
          </v-btn>
        </form>
      </section>

      <div
        v-show="alignedData.length === 0"
        class="mt-11 text-center hidden-md-and-up"
      >
        <i class="bx bx-data bx-lg grey--text"></i>
        <h3 class="grey--text">Your data will appear here</h3>
      </div>

      <div class="expansion-panels-div">
        <v-expansion-panels multiple>
          <v-expansion-panel v-for="(data, i) in alignedData" :key="i">
            <v-expansion-panel-header>
              <template v-slot:default="{ open }">
                <v-row no-gutters>
                  <v-col cols="4">
                    <h3>{{ data.time | dateFilter }}</h3>
                  </v-col>
                  <v-col cols="8" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <span v-if="open" key="0">Details</span>
                      <span v-else key="1">
                        <i class="bx bxs-thermometer"></i>
                        Temperature: {{ data.temperature }}&#8451;
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item class="grey--text">
                    <v-list-item-icon>
                      <i class="bx bxs-thermometer bx-sm"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Temperature</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title
                        >{{ data.temperature }}&#8451;
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item class="grey--text">
                    <v-list-item-icon>
                      <i class="bx bx-droplet bx-sm"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Humidity Levels</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.humidity }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item class="grey--text">
                    <v-list-item-icon>
                      <i class="bx bx-cloud bx-sm"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Cloud Covers</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.cloudcover }}%
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider />
                  <v-list-item class="grey--text">
                    <v-list-item-icon>
                      <i class="bx bx-wind bx-sm"></i>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Wind Speed </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ data.windspeed }}km/h
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </main>
  </v-app>
</template>

<script>
import moment from "moment";

export default {
  name: "App",

  data() {
    return {
      latitude: "",
      longitude: "",

      hourlyWeatherData: null,
      alignedData: [],
    };
  },

  filters: {
    dateFilter(val) {
      return moment(String(val)).format("h A");
    },
  },

  methods: {
    async getWeatherData() {
      try {
        if (this.latitude === "" && this.longitude === "") {
          alert("The latitude and longitude must be filled!");
        } else {
          const resp = await this.$http.get(
            `/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&hourly=temperature_2m,relativehumidity_2m,cloudcover,windspeed_120m`
          );
          this.hourlyWeatherData = resp.data.hourly;
          this.showOnlyTodaysWeatherData();
        }
        this.latitude = "";
        this.longitude = "";
      } catch (e) {
        console.log(e.message);
      }
    },

    showOnlyTodaysWeatherData() {
      let today = new Date().getDate();
      this.alignedData = [];
      this.hourlyWeatherData.time.map((time, i) => {
        let timeRange = new Date(time).getHours();
        let timeDate = new Date(time).getDate();
        if (timeRange >= 6 && timeRange <= 18 && timeDate === today) {
          this.alignedData.push({
            time: time,
            humidity: this.hourlyWeatherData.relativehumidity_2m[i],
            windspeed: this.hourlyWeatherData.windspeed_120m[i],
            temperature: this.hourlyWeatherData.temperature_2m[i],
            cloudcover: this.hourlyWeatherData.cloudcover[i],
          });
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  height: 70px
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 16px
  background-color: rgba(0, 0, 0, 0.7)

.form-div
  text-align: center
  @media screen and (max-width: 600px)
    padding: 10px
    margin-top: 1rem

  @media screen and (min-width: 900px)
    width: 40%
    margin: 3rem auto

.expansion-panels-div
  margin: 3rem auto
  @media screen and (max-width: 600px)
    padding: 10px
    margin-top: 1rem

  @media screen and (min-width: 900px)
    width: 50%
    margin: 3rem auto

.input-field
  color: white
</style>
