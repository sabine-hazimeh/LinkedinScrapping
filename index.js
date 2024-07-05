
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const keyword = "Engineering";  
const location = "Lebanon"; 
const baseUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${keyword}&location=${location}&trk=public_jobs_jobs-search-bar_search-submit&start=`;

let linkedinJobs = [];

async function scrapeJobs() {
  for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
    try {
      const response = await axios.get(baseUrl + pageNumber);
      const html = response.data;
      const $ = cheerio.load(html);
      const jobs = $("li");

      jobs.each((index, element) => {
        const jobTitle = $(element)
          .find("h3.base-search-card__title")
          .text()
          .trim();
        const company = $(element)
          .find("h4.base-search-card__subtitle")
          .text()
          .trim();
        const location = $(element)
          .find("span.job-search-card__location")
          .text()
          .trim();
        const listDate = $(element)
          .find("time.job-search-card__listdate")
          .attr("datetime");
        
        const link = $(element).find("a.base-card__full-link").attr("href");

        linkedinJobs.push({
          Title: jobTitle,
          Company: company,
          Location: location,
          ListDate: listDate,
          Link: link,
        });
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      break; 
    }
  }

  fs.writeFile("linkedinJobs.json", JSON.stringify(linkedinJobs, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Data successfully written to linkedinJobs.json");
    }
  });
}

scrapeJobs();