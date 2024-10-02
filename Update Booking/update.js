const surveyJSON = {
  title: "Update Booking - Corporate Training Resource Booking System",
  pages: [
    {
      name: "booking_id_page",
      elements: [
        {
          type: "text",
          name: "booking_id",
          title: "Enter Your Booking ID",
          isRequired: true,
        },
      ],
    },
    {
      name: "update_booking_page",
      visibleIf: "{booking_id} notempty",
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
          isRequired: true,
          validators: [
            {
              type: "email",
              text: "Please enter a valid email address.",
            },
          ],
          inputType: "email",
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
          isRequired: true,
          choices: ["Room", "Projector", "Laptop"],
        },
        {
          type: "dropdown",
          name: "resource_name",
          title: "Select Resource",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "booking_date",
          title: "Select Booking Date",
          isRequired: true,
        },
        {
          type: "dropdown",
          name: "booking_time",
          title: "Select Booking Time",
          isRequired: true,
        },
      ],
    },
  ],
  showProgressBar: "top",
};

const survey = new Survey.Model(surveyJSON);

document.addEventListener("DOMContentLoaded", function () {
  const surveyElement = document.getElementById("surveyContainer");
  survey.render(surveyElement);
});

survey.onValueChanged.add((sender, options) => {
  // console.log(options, "conDfalse");
  if (options.question.name == "booking_id") {
    fetch
    
  }
});

// {
//     "Booking ID": "B1711",
//     "Resource Type": "Laptop",
//     "Booking Date": "27-09-2024",
//     "Resource ID": 15,
//     "Resource Name": "Laptop E",
//     "Email ": "rugved@quickwork.co",
//     "Employee ID": 123,
//     "Booking Time": "06:00 PM - 07:00 PM",
//     "Row Number": 4,
//     "Name": "Rugved Kute"
// }