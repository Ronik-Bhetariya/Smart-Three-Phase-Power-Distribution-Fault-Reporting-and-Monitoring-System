app.controller("MainController", function ($scope, $location, $timeout, ApiService) {
  $scope.menuOpen = false;
  $scope.adminMenuOpen = false;
  $scope.powerStatuses = [];
  $scope.notifications = [];
  $scope.dashboard = {};
  $scope.message = "";
  $scope.errorMessage = "";

  $scope.faultData = {
    reporterName: "",
    phone: "",
    location: "",
    description: "",
    imageUrl: "",
    severity: "Low",
  };

  $scope.complaintData = {
    name: "",
    phone: "",
    complaintType: "",
    details: "",
  };

  $scope.complaintId = "";
  $scope.complaintResult = null;
  $scope.billData = null;
  $scope.consumerNumber = "";
  $scope.admin = { email: "", password: "" };
  $scope.adminResult = null;
  if (!$scope.$root.adminActiveSection) {
    $scope.$root.adminActiveSection = "admin-complaints";
  }
  $scope.allComplaints = [];
  $scope.allBills = [];
  $scope.allFaults = [];
  $scope.newBill = {
    consumerNumber: "",
    consumerName: "",
    amount: "",
    dueDate: "",
    billMonth: "",
  };
  $scope.powerSchedule = {
    startTime: "",
    endTime: "",
  };
  $scope.lastFault = null;
  $scope.faultTrack = { faultId: "", phone: "" };
  $scope.faultTrackResults = [];

  const syncUI = () => $scope.$applyAsync();

  $scope.toggleMenu = function () {
    $scope.menuOpen = !$scope.menuOpen;
  };

  $scope.closeMenu = function () {
    $scope.menuOpen = false;
  };

  $scope.toggleAdminMenu = function () {
    $scope.adminMenuOpen = !$scope.adminMenuOpen;
  };

  $scope.isAdminRoute = function () {
    return $location.path() === "/admin-dashboard";
  };

  $scope.goToAdminSection = function (sectionId) {
    $scope.$root.adminActiveSection = sectionId;
    $scope.adminMenuOpen = false;
  };

  $scope.loadPowerStatus = async function () {
    try {
      const response = await ApiService.getPowerStatus();
      $scope.powerStatuses = response.data;
    } catch (error) {
      $scope.errorMessage = "Unable to load live power status.";
    } finally {
      syncUI();
    }
  };

  $scope.submitFault = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    $scope.lastFault = null;
    try {
      const response = await ApiService.reportFault($scope.faultData);
      $scope.lastFault = response.data;
      $scope.message = `Fault reported successfully. Complaint ID: ${response.data.faultId}`;
      $scope.faultData = {
        reporterName: "",
        phone: "",
        location: "",
        description: "",
        imageUrl: "",
        severity: "Low",
      };
    } catch (error) {
      $scope.errorMessage = "Failed to report fault.";
    } finally {
      syncUI();
    }
  };

  $scope.trackFault = async function () {
    $scope.errorMessage = "";
    $scope.message = "";
    $scope.faultTrackResults = [];

    const faultId = ($scope.faultTrack.faultId || "").trim();
    const phone = ($scope.faultTrack.phone || "").trim();
    if (!faultId && !phone) {
      $scope.errorMessage = "Enter Fault Track ID or phone number.";
      return;
    }

    try {
      const params = faultId ? { faultId } : { phone };
      const response = await ApiService.trackFault(params);
      $scope.faultTrackResults = response.data.results || [];
    } catch (error) {
      $scope.errorMessage = error?.data?.message || "No fault record found.";
    } finally {
      syncUI();
    }
  };

  $scope.submitComplaint = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.createComplaint($scope.complaintData);
      $scope.message = `Complaint registered. Your ID: ${response.data.complaintId}`;
      $scope.complaintData = { name: "", phone: "", complaintType: "", details: "" };
    } catch (error) {
      $scope.errorMessage = "Failed to register complaint.";
    } finally {
      syncUI();
    }
  };

  $scope.trackComplaint = async function () {
    $scope.complaintResult = null;
    $scope.errorMessage = "";
    try {
      const response = await ApiService.trackComplaint($scope.complaintId);
      $scope.complaintResult = response.data;
    } catch (error) {
      $scope.errorMessage = "Complaint not found. Please check ID.";
    } finally {
      syncUI();
    }
  };

  $scope.fetchBill = async function () {
    $scope.billData = null;
    $scope.errorMessage = "";
    const consumerNumber = ($scope.consumerNumber || "").trim();
    if (!consumerNumber) {
      $scope.errorMessage = "Please enter consumer number.";
      return;
    }
    try {
      const response = await ApiService.fetchBill(consumerNumber);
      $scope.billData = response.data;
    } catch (error) {
      $scope.errorMessage = "Bill not found.";
    } finally {
      syncUI();
    }
  };

  $scope.payBill = async function () {
    $scope.errorMessage = "";
    try {
      const response = await ApiService.payBill($scope.billData._id);
      $scope.billData = response.data;
      $scope.message = "Bill payment successful.";
    } catch (error) {
      $scope.errorMessage = "Payment failed.";
    } finally {
      syncUI();
    }
  };

  $scope.seedBills = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.seedBills();
      $scope.message = response.data.message || "Sample bills created.";
    } catch (error) {
      const msg = error?.data?.message || "";
      if (msg === "Sample bills already created") {
        $scope.message = "Sample bills already exist. Fetch using 1002003001 or 1002003002.";
      } else {
        $scope.errorMessage = "Unable to create sample bills.";
      }
    } finally {
      syncUI();
    }
  };

  $scope.loadDashboard = async function () {
    try {
      const response = await ApiService.getDashboard();
      $scope.dashboard = response.data;
    } catch (error) {
      $scope.errorMessage = "Failed to load dashboard.";
    } finally {
      syncUI();
    }
  };

  $scope.loadAdminData = async function () {
    try {
      const [complaintsRes, billsRes, faultsRes, powerRes] = await Promise.all([
        ApiService.getComplaints(),
        ApiService.getAllBills(),
        ApiService.getFaults(),
        ApiService.getPowerStatus(),
      ]);
      $scope.allComplaints = complaintsRes.data;
      $scope.allBills = billsRes.data;
      $scope.allFaults = faultsRes.data;
      $scope.powerStatuses = powerRes.data;
    } catch (error) {
      $scope.errorMessage = "Failed to load admin dashboard data.";
    } finally {
      syncUI();
    }
  };

  $scope.seedPowerData = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.seedPower();
      $scope.message = response.data.message || "Power phases initialized.";
      await $scope.loadAdminData();
    } catch (error) {
      const msg = error?.data?.message || "";
      if (msg === "Power data already exists") {
        $scope.message = "Power data already initialized.";
      } else {
        $scope.errorMessage = "Unable to initialize power data.";
      }
    } finally {
      syncUI();
    }
  };

  $scope.applyPowerSchedule = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    const startTime = $scope.powerSchedule.startTime;
    const endTime = $scope.powerSchedule.endTime;
    if (!startTime || !endTime) {
      $scope.errorMessage = "Please select start and end time for power schedule.";
      return;
    }
    try {
      const response = await ApiService.schedulePowerWindow({ startTime, endTime });
      $scope.message =
        response.data.message ||
        "Power schedule applied. Three phases will be ON in selected time and OFF outside.";
      await $scope.loadAdminData();
      await $scope.loadPowerStatus();
    } catch (error) {
      $scope.errorMessage = error?.data?.message || "Unable to apply power schedule.";
    } finally {
      syncUI();
    }
  };

  $scope.updateComplaintStatus = async function (complaint) {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.updateComplaint(complaint._id, {
        status: complaint.status,
        remarks: complaint.remarks || "",
      });
      complaint.status = response.data.status;
      complaint.remarks = response.data.remarks;
      $scope.message = `Complaint ${complaint.complaintId} updated.`;
    } catch (error) {
      $scope.errorMessage = "Unable to update complaint.";
    } finally {
      syncUI();
    }
  };

  $scope.updateFaultStatus = async function (fault) {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.updateFault(fault._id, {
        status: fault.status,
      });
      fault.status = response.data.status;
      $scope.message = `Fault ${fault.faultId} updated.`;
    } catch (error) {
      $scope.errorMessage = "Unable to update fault status.";
    } finally {
      syncUI();
    }
  };

  $scope.updatePower = async function (phase) {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.updatePowerPhase(phase.phase, {
        state: phase.state,
        voltage: phase.voltage,
        frequency: phase.frequency,
      });
      phase.state = response.data.state;
      phase.voltage = response.data.voltage;
      phase.frequency = response.data.frequency;
      $scope.message = `Power phase ${phase.phase} updated.`;
    } catch (error) {
      $scope.errorMessage = "Unable to update power phase.";
    } finally {
      syncUI();
    }
  };

  $scope.createBill = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.createBill({
        consumerNumber: ($scope.newBill.consumerNumber || "").trim(),
        consumerName: ($scope.newBill.consumerName || "").trim(),
        amount: Number($scope.newBill.amount),
        dueDate: $scope.newBill.dueDate,
        billMonth: ($scope.newBill.billMonth || "").trim(),
      });
      $scope.message = "New bill created successfully.";
      $scope.newBill = {
        consumerNumber: "",
        consumerName: "",
        amount: "",
        dueDate: "",
        billMonth: "",
      };
      $scope.allBills.unshift(response.data);
    } catch (error) {
      $scope.errorMessage = "Unable to create bill. Please check all fields.";
    } finally {
      syncUI();
    }
  };

  $scope.loadNotifications = async function () {
    try {
      const response = await ApiService.getNotifications();
      $scope.notifications = response.data;
    } catch (error) {
      $scope.errorMessage = "Failed to load notifications.";
    } finally {
      syncUI();
    }
  };

  $scope.adminLogin = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    $scope.adminResult = null;
    try {
      const response = await ApiService.adminLogin($scope.admin);
      $scope.adminResult = response.data.admin;
      localStorage.setItem("power-admin-token", response.data.token);
      $scope.message = "Admin login successful.";
      $location.path("/admin-dashboard");
      $scope.loadAdminData();
    } catch (error) {
      $scope.errorMessage = "Invalid admin credentials.";
    } finally {
      syncUI();
    }
  };

  $scope.seedAdmin = async function () {
    $scope.message = "";
    $scope.errorMessage = "";
    try {
      const response = await ApiService.seedAdmin();
      $scope.message = response.data.message || "Admin account created.";
    } catch (error) {
      $scope.message =
        error?.data?.message === "Admin already exists"
          ? "Admin already exists. You can login now."
          : "";
      $scope.errorMessage =
        error?.data?.message && error?.data?.message !== "Admin already exists"
          ? error.data.message
          : $scope.errorMessage;
    } finally {
      syncUI();
    }
  };

  $scope.adminLogout = function () {
    localStorage.removeItem("power-admin-token");
    $scope.adminResult = null;
    $scope.adminMenuOpen = false;
    $scope.message = "";
    $scope.errorMessage = "";
    sessionStorage.setItem("logoutFlashMessage", "Logged out successfully.");
    $location.path("/");
    syncUI();
  };

  $scope.$on("$routeChangeSuccess", function () {
    $scope.menuOpen = false;

    const logoutFlashMessage = sessionStorage.getItem("logoutFlashMessage");
    if (logoutFlashMessage) {
      $scope.message = logoutFlashMessage;
      sessionStorage.removeItem("logoutFlashMessage");
      $timeout(function () {
        $scope.message = "";
      }, 2500);
    }
  });

  $scope.loadPowerStatus();
  $scope.loadDashboard();
  $scope.loadNotifications();
  $scope.loadAdminData();
});
