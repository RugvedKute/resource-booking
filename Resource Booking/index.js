var dataArray = [];

const authToken = "tvqazq6ElMKZBEQJnN6oatOZS4TRrOUY";
const surveyJson = {
  title: "Corporate Training Resource Booking System",
  showProgressBar: "top",
  elements: [
    {
      type: "text",
      name: "employee_name",
      title: "Your Name",
      isRequired: true,
    },
    {
      type: "text",
      name: "employee_email",
      title: "Your Email",
      inputType: "email",
      isRequired: true,
      validators: [
        {
          type: "email",
          text: "Please enter a valid email address.",
        },
      ],
    },
    {
      type: "text",
      name: "employee_id",
      title: "Employee ID",
      isRequired: true,
    },
    {
      type: "dropdown",
      name: "resource_type",
      title: "Select Resource Type",
      choices: ["Room", "Projector", "Laptop"],
      isRequired: true,
      hasOther: false,
    },
    {
      type: "dropdown",
      name: "resource_name",
      title: "Select Resource",
      isRequired: true,
      choices: [],
    },
    {
      type: "dropdown",
      name: "booking_date",
      title: "Select Booking Date",
      isRequired: true,
      choices: [],
    },
    {
      type: "dropdown",
      name: "booking_time",
      title: "Select Booking Time",
      isRequired: true,
      choices: [],
    },
  ],
};

const survey = new Survey.Model(surveyJson);

document.addEventListener("DOMContentLoaded", function () {
  const surveyElement = document.getElementById("surveyContainer");
  survey.render(surveyElement);

  fetch(`https://apim.quickwork.co/Quickwork2/resource-booking/v1/get-resources`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      APIkey: authToken,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      dataArray = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
});

survey.onValueChanged.add((sender, options) => {
  switch (options.question.name) {
    case "resource_type":
      const resources = dataArray
        .filter((data) => data["Resource Type"] === options.value && data["Availability"] === "Yes")
        .map((data) => data["Resource Name"]);
      survey.getQuestionByName("resource_name").choices = [...new Set(resources)];
      break;

    case "resource_name":
      const dates = dataArray
        .filter((data) => data["Resource Name"] === options.value && data["Availability"] === "Yes")
        .map((data) => data["Available Dates"]);
      survey.getQuestionByName("booking_date").choices = [...new Set(dates)];
      break;

    case "booking_date":
      const times = dataArray
        .filter(
          (data) =>
            data["Available Dates"] === options.value &&
            data["Resource Name"] === survey.getValue("resource_name") &&
            data["Availability"] === "Yes"
        )
        .map((data) => data["Available Times"]);
      survey.getQuestionByName("booking_time").choices = [...new Set(times)];
      break;
  }
});
survey.onComplete.add(bookResource);

function bookResource(sender) {
  const surveyData = sender.data;
  const bookingID = "B" + parseInt(Math.random() * 10000);

  const resourceEntry = dataArray.find(
    (data) =>
      data["Resource Name"] === surveyData["resource_name"] &&
      data["Available Dates"] === surveyData["booking_date"] &&
      data["Available Times"] === surveyData["booking_time"]
  );

  const resourceId = resourceEntry ? resourceEntry["Resource ID"] : null;

  let data = {
    "Booking ID": bookingID,
    "Name": surveyData["employee_name"],
    "Email": surveyData["employee_email"],
    "Employee ID": surveyData["employee_id"],
    "Resource Name": surveyData["resource_name"],
    "Resource Type": surveyData["resource_type"],
    "Booking Date": surveyData["booking_date"],
    "Booking Time": surveyData["booking_time"],
    "Resource ID": resourceId
  };

  fetch(`https://apim.quickwork.co/Quickwork2/resource-booking/v1/book-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      APIkey: authToken,
    },
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((response) => {
      dataArray = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
