function extractTextFromReactElement(element) {
  if (typeof element === "string") return element;
  if (Array.isArray(element))
    return element.map(extractTextFromReactElement).join(" ");
  if (element && typeof element === "object" && element.$$typeof) {
    return element.props?.children
      ? extractTextFromReactElement(element.props.children)
      : "";
  }
  return "";
}

const getCreatedByName = (userFieldType) => {
  const userInfo = JSON.parse(localStorage.getItem("user")) || {};
  const defaultName = "John Doe";

  if (
    [
      "appraiserCompany_Datails",
      "broker_Details",
      "appraiser_Details",
    ].includes(userFieldType)
  ) {
    return `${userInfo?.[userFieldType]?.firstName || "John"} ${
      userInfo?.[userFieldType]?.lastName || "Doe"
    }`;
  }
  if (userFieldType === "brokerage_Details") {
    return `${userInfo?.[userFieldType]?.assistantFirstName || "John"} ${
      userInfo?.[userFieldType]?.assistantLastName || "Doe"
    }`;
  }

  return defaultName;
};

function getFormattedDateTime() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
}

function UserNameLinkData(element) {
  if (typeof element === "string") {
    return element;
  }

  if (Array.isArray(element)) {
    return element
      .map((child) => UserNameLinkData(child))
      .filter(Boolean)
      .join(" ");
  }

  if (element && typeof element === "object" && element.props?.children) {
    return UserNameLinkData(element.props.children);
  }
  return undefined;
}

export const getTheDownloadView = (
  userFieldType,
  allData,
  pdfTitle,
  staticHeaders,
  rowsPerPage = 9
) => {
  return new Promise((resolve, reject) => {
    try {
      const printContent = `
        <html>
          <head>
            <style>
              @media print {
                @page {
                  size: A4 landscape;
                  margin: 0;
                }
                .footer {
                  position: fixed;
                  left: 0;
                  right: 0;
                  bottom: 0;
                }
                thead {
                  display: table-header-group;
                }
                .page-break {
                  page-break-after: always;
                }
              }

              body {
                margin: 0;
                font-family: Arial, sans-serif;
              }

              .pdf-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
              }

              .table-container {
                width: 100%;
              }

              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                font-family: Arial;
              }

              th, td {
                border: 1px solid #000;
                padding: 8px;
              }

              .header {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom:10px;
              }

              .logo {
                height: 70px;
                width: 80px;
                margin-bottom: 4px;
              }

              .footer {
                width: 100%;
                text-align: center;
                padding-top: 10px;
                font-size: 12px;
              }
.watermark {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.05;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.watermark img {
  width: 400px;
  height: auto;
}

            </style>
          </head>
          <body>
          <div class="watermark">
  <img src="/assets/images/Appraisal_Land_Logo.png" alt="Watermark Logo" />
</div>

            <div class="pdf-container">
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th colspan="${
                        staticHeaders.length
                      }" style="text-align: center; border: none;">
                        <div class="header">
                          <img src="/assets/images/Appraisal_Land_Logo.png" alt="Company Logo" class="logo" />
                          <h3 style="margin: 0;">${pdfTitle}</h3>
                        </div>
                      </th>
                    </tr>
                    <tr>
                      ${staticHeaders
                        .map((header) => `<th>${header[1]}</th>`)
                        .join("")}
                    </tr>
                  </thead>
                  <tbody>
                    ${allData
                      .map((item, index) => {
                        const rowHtml = `
                          <tr>
                            ${staticHeaders
                              .map((header) => {
                                const key = header[0].toLowerCase();
                                const value = item[key];
                                if (
                                  [
                                    "appraisal_status",
                                    "status",
                                    "assigned_appraiser",
                                  ].includes(key)
                                ) {
                                  const className =
                                    value?.props?.className || "";
                                  const content =
                                    key === "appraisal_status" &&
                                    !String(value?.props?.children)
                                      ?.toLowerCase()
                                      .includes("n.a")
                                      ? extractTextFromReactElement(
                                          value?.props?.children
                                        ).split("Current Status")[0]
                                      : value?.props?.children;

                                  const color = className.includes(
                                    "btn-warning"
                                  )
                                    ? "#E4A11B"
                                    : className.includes("btn-danger")
                                    ? "#DC4C64"
                                    : className.includes("btn-success")
                                    ? "#14A44D"
                                    : "#54B4D3";

                                  return `<td style="color: ${color};">${content}</td>`;
                                }

                                if (
                                  [
                                    "broker",
                                    "appraiser",
                                    "brokerage",
                                    "appraiser_info",
                                    "appraiserCompany",
                                    "appraisercompany",
                                  ].includes(key)
                                ) {
                                  const content = UserNameLinkData(value);
                                  return `<td style="color: #54B4D3;">${content}</td>`;
                                }

                                const updatedValue = item[key];
                                return `<td>${
                                  updatedValue == undefined
                                    ? "N.A."
                                    : updatedValue
                                }</td>`;
                              })
                              .join("")}
                          </tr>
                        `;
                        // const isPageBreak =
                        //   (index + 1) % 9 === 0
                        //     ? '<tr class="page-break"></tr>'
                        //     : "";
                        const isPageBreak =
                          (index + 1) % rowsPerPage === 0
                            ? '<tr class="page-break"></tr>'
                            : "";
                        return rowHtml + isPageBreak;
                      })
                      .join("")}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="${staticHeaders.length}">
                        <div class="footer" style="margin-top:10px">
                          <p>© ${new Date().getFullYear()} 
                            <a href="https://appraisalland.ca/" target="_blank" style="color: #2e008b; text-decoration: none; font-size:12px;">
                              Appraisal Land
                            </a>. All Rights Reserved.
                            <span>Created by: ${getCreatedByName(
                              userFieldType
                            )}</span>
                            <span>Created on: ${getFormattedDateTime()}</span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </body>
        </html>
      `;

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        reject(new Error("Failed to access iframe document"));
        return;
      }

      doc.open();
      doc.write(printContent);
      doc.close();

      iframe.onload = () => {
        try {
          const printWindow = iframe.contentWindow;
          if (!printWindow) throw new Error("Print window not found");

          printWindow.focus();
          printWindow.print();

          let alreadyHandled = false;
          const checkClose = () => {
            if (alreadyHandled) return;
            alreadyHandled = true;
            document.body.removeChild(iframe);
            resolve("Print dialog closed.");
          };

          printWindow.onafterprint = checkClose;

          setTimeout(() => {
            checkClose();
          }, 10000);
        } catch (e) {
          reject(new Error("Error during iframe print"));
        }
      };
    } catch (error) {
      console.error({ error });
      reject(new Error("Error handling print via iframe"));
    }
  });
};
