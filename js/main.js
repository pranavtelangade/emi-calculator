$(document).ready(function () {
  let loan_amount = 75000;
  let loan_duration_yearly = 1;
  let loan_duration_monthly = loan_duration_yearly * 12;
  let loan_roi = eval(12 / 12 / 100);
  let loan_roi_pa = 10.99;
  document.getElementById("loan_amount_input").value =
    Intl.NumberFormat("en-IN").format(loan_amount);
  document.getElementById("loan_duration_input").value = loan_duration_yearly;
  document.getElementById("loan_rate_input").value = loan_roi_pa;

  $(".js-range-slider-one").ionRangeSlider({
    min: 75000,
    max: 3500000,
    prefix: "₹",
    onChange: function (data) {
      loan_amount = data.from;
      document.getElementById("loan_amount_input").value =
        Intl.NumberFormat("en-IN").format(loan_amount);
    },
    onFinish: function () {
      emi_calculate();
      mychart.destroy();
      createChart();
    },
  });

  $(".js-range-slider-two").ionRangeSlider({
    min: 1,
    max: 6,
    postfix: " Years",
    onChange: function (data) {
      loan_duration_yearly = data.from;
      document.getElementById("loan_duration_input").value =
        loan_duration_yearly;
    },
    onFinish: function () {
      loan_duration_monthly = loan_duration_yearly * 12;
      emi_calculate();
      mychart.destroy();
      createChart();
    },
  });

  $(".js-range-slider-three").ionRangeSlider({
    min: 10.99,
    max: 35,
    step: 0.01,
    postfix: " % p.a.",
    onChange: function (data) {
      loan_roi_pa = data.from;
      loan_roi = eval(loan_roi_pa / 12 / 100);
      document.getElementById("loan_rate_input").value = loan_roi_pa;
    },
    onFinish: function () {
      emi_calculate();
      mychart.destroy();
      createChart();
    },
  });
  emi_calculate();
  createChart();

  document.querySelectorAll(".duration_type").forEach((element) => {
    element.addEventListener("click", function (e) {
      if (e.target.id == "year") {
        if (!e.target.classList.contains("selected")) {
          e.target.classList.add("selected");
          e.target.nextElementSibling.classList.remove("selected");
        }
        loan_duration_yearly = (loan_duration_monthly / 12).toFixed(0);
        document.getElementById("loan_duration_input").value =
          loan_duration_yearly;
        emi_calculate();
        mychart.destroy();
        createChart();
        document
          .getElementById("loan_duration_input")
          .addEventListener("input", function (e) {
            if (6 >= e.target.value && e.target.value >= 1) {
              let my_range = $(".js-range-slider-two").data("ionRangeSlider");
              my_range.update({
                from: `${e.target.value}`,
              });
              loan_duration_monthly = loan_duration_yearly * 12;
              emi_calculate();
              mychart.destroy();
              createChart();
            }
          });
        let my_range = $(".js-range-slider-two").data("ionRangeSlider");
        my_range.update({
          min: 1,
          max: 6,
          from: `${loan_duration_yearly}`,
          postfix: " Years",
          onChange: function (data) {
            loan_duration_yearly = data.from;
            document.getElementById("loan_duration_input").value =
              loan_duration_yearly;
          },
          onFinish: function () {
            loan_duration_monthly = loan_duration_yearly * 12;

            emi_calculate();
            mychart.destroy();
            createChart();
          },
        });
      } else {
        if (!e.target.classList.contains("selected")) {
          e.target.classList.add("selected");
          e.target.previousElementSibling.classList.remove("selected");
        }
        loan_duration_monthly = loan_duration_yearly * 12;
        document
          .getElementById("loan_duration_input")
          .addEventListener("input", function (e) {
            if (72 >= e.target.value && e.target.value >= 12) {
              let my_range = $(".js-range-slider-two").data("ionRangeSlider");
              my_range.update({
                from: `${e.target.value}`,
              });
              emi_calculate();
              mychart.destroy();
              createChart();
            }
          });
        emi_calculate();
        mychart.destroy();
        createChart();
        let my_range = $(".js-range-slider-two").data("ionRangeSlider");
        my_range.update({
          min: 12,
          max: 72,
          from: `${loan_duration_monthly}`,
          postfix: " Months",
          onChange: function (data) {
            loan_duration_monthly = data.from;
            document.getElementById("loan_duration_input").value =
              loan_duration_monthly;
          },
          onFinish: function () {
            emi_calculate();
            mychart.destroy();
            createChart();
          },
        });
        document.getElementById("loan_duration_input").value =
          loan_duration_monthly;
      }
    });
  });

  document
    .getElementById("loan_amount_input")
    .addEventListener("input", function (e) {
      let input = e.target.value.split(",").join("");
      if (3500000 >= input && input >= 75000) {
        let my_range = $(".js-range-slider-one").data("ionRangeSlider");
        my_range.update({
          from: `${input}`,
        });
      }
    });
  document
    .getElementById("loan_amount_input")
    .addEventListener("blur", function (e) {
      let input = e.target.value.split(",").join("");
      document.getElementById("loan_amount_input").value =
        Intl.NumberFormat("en-IN").format(input);
    });

  document
    .getElementById("loan_duration_input")
    .addEventListener("input", function (e) {
      if (72 >= e.target.value && e.target.value >= 12) {
        let my_range = $(".js-range-slider-two").data("ionRangeSlider");
        my_range.update({
          from: `${e.target.value}`,
        });
      }
    });

  document
    .getElementById("loan_rate_input")
    .addEventListener("input", function (e) {
      if (35 >= e.target.value && e.target.value >= 10.99) {
        let my_range = $(".js-range-slider-three").data("ionRangeSlider");
        my_range.update({
          from: `${e.target.value}`,
        });
      }
    });

  function createChart() {
    ctx = document.getElementById("myChart");
    const data = {
      labels: ["Total Interest Payable", "Total Amount Payable"],
      datasets: [
        {
          data: [total_amount.toFixed(0), total_interest.toFixed(0)],
        },
      ],
    };
    mychart = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        backgroundColor: ["#2e93eb", "#d8e024"],
        borderWidth: 0.5,
        borderAlign: "inner",
        rotation: 90,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
    document.getElementById("total_amount_dynamic").innerHTML =
      "₹" + Intl.NumberFormat("en-IN").format(total_amount.toFixed(0)) + "*";
    document.getElementById("total_interest_dynamic").innerHTML =
      "₹" + Intl.NumberFormat("en-IN").format(total_interest.toFixed(0)) + "*";
    document.getElementById("monthly_emi").innerHTML =
      "₹" + Intl.NumberFormat("en-IN").format(EMI_amount.toFixed(0)) + "*";
  }

  function emi_calculate() {
    EMI_amount = eval(
      loan_amount *
        loan_roi *
        ((1 + loan_roi) ** loan_duration_monthly /
          ((1 + loan_roi) ** loan_duration_monthly - 1))
    );
    total_amount = EMI_amount * loan_duration_monthly;
    total_interest = total_amount - loan_amount;
  }
});
