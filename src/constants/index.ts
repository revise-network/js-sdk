const URLS = {
  BASE_URL: "https://api.revise.network",
  DOCS_URL: "https://docs.revise.network",
  REVISE_URL: "https://revise.link"
};

const ERRORS = {
  TOKEN: {
    NOT_INITIALIZED: {
      code: 403,
      message: "Token not initialized",
      description:
        'Initialize the token => new Revise({ auth: "YOUR_AUTH_TOKEN"  });',
    },
    NOT_FOUND: { statusCode: 401, message: "Token not found" },
  },
  TRY_AGAIN: { code: "500", message: "Something Went Wrong!! Try Again" },
  ENOTFOUND: {
    code: "500",
    message: "Server Error",
    description: "indicates that the Server URL not valid.",
  },
  "100": {
    code: "100",
    message: "Continue",
    description:
      "indicates that the initial part of a request has been received and has not yet been rejected by the server.",
  },
  "101": {
    code: "101",
    message: "Switching Protocols",
    description:
      "indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.",
  },
  "200": {
    code: "200",
    message: "OK",
    description: "indicates that the request has succeeded.",
  },
  "201": {
    code: "201",
    message: "Created",
    description:
      "indicates that the request has been fulfilled and has resulted in one or more new resources being created.",
    spec_title: "RFC7231#6.3.2",
  },
  "202": {
    code: "202",
    message: "Accepted",
    description:
      "indicates that the request has been accepted for processing, but the processing has not been completed.",
  },
  "203": {
    code: "203",
    message: "Non-Authoritative Information",
    description:
      "indicates that the request was successful but the enclosed payload has been modified from that of the origin server's 200 (OK) response by a transforming proxy.",
  },
  "204": {
    code: "204",
    message: "No Content",
    description:
      "indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.",
  },
  "205": {
    code: "205",
    message: "Reset Content",
    description:
      "indicates that the server has fulfilled the request and desires that the user agent reset the document view, which caused the request to be sent, to its original state as received from the origin server.",
  },
  "206": {
    code: "206",
    message: "Partial Content",
    description:
      "indicates that the server is successfully fulfilling a range request for the target resource by transferring one or more parts of the selected representation that correspond to the satisfiable ranges found in the requests's Range header field.",
  },
  "300": {
    code: "300",
    message: "Multiple Choices",
    description:
      "indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers.",
  },
  "301": {
    code: "301",
    message: "Moved Permanently",
    description:
      "indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.",
  },
  "302": {
    code: "302",
    message: "Found",
    description:
      "indicates that the target resource resides temporarily under a different URI.",
  },
  "303": {
    code: "303",
    message: "See Other",
    description:
      "indicates that the server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, that is intended to provide an indirect response to the original request.",
  },
  "304": {
    code: "304",
    message: "Not Modified",
    description:
      "indicates that a conditional GET request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition has evaluated to false.",
  },
  "305": {
    code: "305",
    message: "Use Proxy",
    description: "*deprecated*",
  },
  "307": {
    code: "307",
    message: "Temporary Redirect",
    description:
      "indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI.",
  },
  "400": {
    code: "400",
    message: "Bad Request",
    description:
      "indicates that the server cannot or will not process the request because the received syntax is invalid, nonsensical, or exceeds some limitation on what the server is willing to process.",
  },
  "401": {
    code: "401",
    message: "Unauthorized",
    description:
      "indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.",
  },
  "402": {
    code: "402",
    message: "Payment Required",
    description: "*reserved*",
  },
  "403": {
    code: "403",
    message: "Forbidden",
    description:
      "indicates that the server understood the request but refuses to authorize it.",
  },
  "404": {
    code: "404",
    message: "Not Found",
    description:
      "indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.",
  },
  "405": {
    code: "405",
    message: "Method Not Allowed",
    description:
      "indicates that the method specified in the request-line is known by the origin server but not supported by the target resource.",
  },
  "406": {
    code: "406",
    message: "Not Acceptable",
    description:
      "indicates that the target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation.",
  },
  "407": {
    code: "407",
    message: "Proxy Authentication Required",
    description:
      "is similar to 401 (Unauthorized), but indicates that the client needs to authenticate itself in order to use a proxy.",
  },
  "408": {
    code: "408",
    message: "Request Timeout",
    description:
      "indicates that the server did not receive a complete request message within the time that it was prepared to wait.",
  },
  "409": {
    code: "409",
    message: "Conflict",
    description:
      "indicates that the request could not be completed due to a conflict with the current state of the resource.",
  },
  "410": {
    code: "410",
    message: "Gone",
    description:
      "indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.",
  },
  "411": {
    code: "411",
    message: "Length Required",
    description:
      "indicates that the server refuses to accept the request without a defined Content-Length.",
  },
  "412": {
    code: "412",
    message: "Precondition Failed",
    description:
      "indicates that one or more preconditions given in the request header fields evaluated to false when tested on the server.",
  },
  "413": {
    code: "413",
    message: "Payload Too Large",
    description:
      "indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process.",
  },
  "414": {
    code: "414",
    message: "URI Too Long",
    description:
      "indicates that the server is refusing to service the request because the request-target is longer than the server is willing to interpret.",
  },
  "415": {
    code: "415",
    message: "Unsupported Media Type",
    description:
      "indicates that the origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method.",
  },
  "416": {
    code: "416",
    message: "Range Not Satisfiable",
    description:
      "indicates that none of the ranges in the request's Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges.",
  },
  "417": {
    code: "417",
    message: "Expectation Failed",
    description:
      "indicates that the expectation given in the request's Expect header field could not be met by at least one of the inbound servers.",
  },
  "418": {
    code: "418",
    message: "I'm a teapot",
    description:
      "Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot.",
  },
  "426": {
    code: "426",
    message: "Upgrade Required",
    description:
      "indicates that the server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.",
  },
  "500": {
    code: "500",
    message: "Internal Server Error",
    description:
      "indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  "501": {
    code: "501",
    message: "Not Implemented",
    description:
      "indicates that the server does not support the functionality required to fulfill the request.",
  },
  "502": {
    code: "502",
    message: "Bad Gateway",
    description:
      "indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.",
  },
  "503": {
    code: "503",
    message: "Service Unavailable",
    description:
      "indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.",
  },
  "504": {
    code: "504",
    message: "Gateway Time-out",
    description:
      "indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.",
  },
  "505": {
    code: "505",
    message: "HTTP Version Not Supported",
    description:
      "indicates that the server does not support, or refuses to support, the protocol version that was used in the request message.",
  },
  "102": {
    code: "102",
    message: "Processing",
    description:
      "is an interim response used to inform the client that the server has accepted the complete request, but has not yet completed it.",
  },
  "207": {
    code: "207",
    message: "Multi-Status",
    description: "provides status for multiple independent operations.",
  },
  "226": {
    code: "226",
    message: "IM Used",
    description:
      "The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
  },
  "308": {
    code: "308",
    message: "Permanent Redirect",
    description:
      "The target resource has been assigned a new permanent URI and any future references to this resource outght to use one of the enclosed URIs. [...] This status code is similar to 301 Moved Permanently (Section 7.3.2 of rfc7231), except that it does not allow rewriting the request method from POST to GET.",
  },
  "422": {
    code: "422",
    message: "Unprocessable Entity",
    description:
      "means the server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions.",
  },
  "423": {
    code: "423",
    message: "Locked",
    description:
      "means the source or destination resource of a method is locked.",
  },
  "424": {
    code: "424",
    message: "Failed Dependency",
    description:
      "means that the method could not be performed on the resource because the requested action depended on another action and that action failed.",
  },
  "428": {
    code: "428",
    message: "Precondition Required",
    description:
      "indicates that the origin server requires the request to be conditional.",
  },
  "429": {
    code: "429",
    message: "Too Many Requests",
    description:
      "indicates that the user has sent too many requests in a given amount of time (rate limiting).",
  },
  "431": {
    code: "431",
    message: "Request Header Fields Too Large",
    description:
      "indicates that the server is unwilling to process the request because its header fields are too large.",
  },
  "451": {
    code: "451",
    message: "Unavailable For Legal Reasons",
    description:
      "This status code indicates that the server is denying access to the resource in response to a legal demand.",
  },
  "506": {
    code: "506",
    message: "Variant Also Negotiates",
    description:
      "indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.",
  },
  "507": {
    code: "507",
    message: "Insufficient Storage",
    description:
      "means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.",
  },
  "511": {
    code: "511",
    message: "Network Authentication Required",
    description:
      "indicates that the client needs to authenticate to gain network access.",
  },
};

export { URLS, ERRORS };
