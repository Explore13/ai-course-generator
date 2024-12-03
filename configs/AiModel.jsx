import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate A Course Tutorial on Following Details With field as Course Name, Description, Along with Chapter Name, about, Duration : Category: 'Programming', Topic: Java, Level:Basic,Duration:3 hours,NoOfChapters:5, in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "CourseName": "Introduction to Java Programming",\n  "Description": "This course provides a foundational understanding of Java programming.  It covers basic syntax, data types, control structures, and object-oriented programming concepts.  Suitable for beginners with little to no prior programming experience.",\n  "Category": "Programming",\n  "Topic": "Java",\n  "Level": "Basic",\n  "Duration": "3 hours",\n  "NoOfChapters": 5,\n  "Chapters": [\n    {\n      "ChapterName": "Setting Up Your Java Environment",\n      "About": "This chapter covers installing the Java Development Kit (JDK), setting up your Integrated Development Environment (IDE) (e.g., Eclipse, IntelliJ), and writing your first \'Hello, World!\' program.",\n      "Duration": "30 minutes"\n    },\n    {\n      "ChapterName": "Java Basics: Data Types and Variables",\n      "About": "Learn about fundamental data types (integers, floating-point numbers, booleans, characters), variable declaration, and basic operators.",\n      "Duration": "45 minutes"\n    },\n    {\n      "ChapterName": "Control Structures: Conditional Statements and Loops",\n      "About": "Master conditional statements (if-else) and looping constructs (for, while) to control the flow of your programs.",\n      "Duration": "1 hour"\n    },\n    {\n      "ChapterName": "Introduction to Object-Oriented Programming (OOP)",\n      "About": "This chapter introduces core OOP concepts such as classes, objects, methods, and attributes.  You\'ll build simple classes and understand the basics of object interaction.",\n      "Duration": "1 hour"\n    },\n    {\n      "ChapterName": "Arrays and Methods",\n      "About": "Learn how to work with arrays to store collections of data and create reusable methods to improve code organization and efficiency.",\n      "Duration": "00:15 minutes"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());



export const GenerateChapterContent_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Explain the concept in Detail on Topic: Springboot, Chapter: Advanced REST Controllers, in JSON Format with list of array with field as title, explanation on given chapter in detail, Code Example(Code field in <precode> format) if applicable."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"title\": \"Advanced Spring Boot REST Controllers\",\n  \"chapters\": [\n    {\n      \"title\": \"Handling Exceptions\",\n      \"explanation\": \"Proper exception handling is crucial for building robust REST APIs.  Spring Boot provides several mechanisms to manage exceptions gracefully and return meaningful responses to clients.  This involves using `@ControllerAdvice` to globally handle exceptions, creating custom exception classes for specific API errors, and using `@ExceptionHandler` methods to map exceptions to HTTP status codes and JSON responses.  This ensures that clients receive informative error messages instead of generic server errors.\",\n      \"codeExample\": \"<precode>\\n@ControllerAdvice\\npublic class GlobalExceptionHandler {\\n\\n    @ExceptionHandler(ResourceNotFoundException.class)\\n    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {\\n        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), request.getDescription(false));\\n        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);\\n    }\\n\\n    // ... other exception handlers\\n}\\n\\nclass ErrorResponse {\\n    private int status;\\n    private String message;\\n    private String description;\\n    // ... constructor, getters and setters\\n}\\n\\nclass ResourceNotFoundException extends RuntimeException {\\n    // ... constructor\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Input Validation\",\n      \"explanation\": \"Validating input data is essential for preventing invalid data from entering your application.  Spring Boot leverages Bean Validation (using annotations like `@NotNull`, `@Size`, `@Pattern`, etc.) to validate request bodies.  The framework automatically handles validation failures and returns appropriate HTTP error responses (usually 400 Bad Request).  You can customize the error messages and improve the user experience by creating custom validation annotations and messages.\",\n      \"codeExample\": \"<precode>\\n@PostMapping\\npublic ResponseEntity<User> createUser(@Valid @RequestBody User user) {\\n    // ... save user\\n}\\n\\nclass User {\\n    @NotNull\\n    @Size(min = 2, max = 25)\\n    private String name;\\n    // ... other fields\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Using Different HTTP Methods Effectively\",\n      \"explanation\": \"RESTful APIs use different HTTP methods (GET, POST, PUT, DELETE, PATCH) to perform different actions.  Choosing the correct method ensures proper API semantics and maintainability.  Understanding the nuances of each method and using them appropriately is key for designing well-structured APIs.  For example, `GET` is for retrieving resources, `POST` for creating, `PUT` for updating the entire resource, `PATCH` for partial updates, and `DELETE` for removing resources.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(\\\"/users/{id}\\\")\\npublic ResponseEntity<User> getUser(@PathVariable Long id) {\\n    // ...\\n}\\n\\n@PostMapping(\\\"/users\\\")\\npublic ResponseEntity<User> createUser(@RequestBody User user) {\\n    // ...\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Implementing HATEOAS (Hypermedia as the Engine of Application State)\",\n      \"explanation\": \"HATEOAS is a REST architectural constraint where the API responses include links to related resources.  This allows clients to navigate the API dynamically without hardcoding URLs, making the API more flexible and discoverable.  Spring HATEOAS provides support for creating HATEOAS-compliant responses.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(\\\"/users/{id}\\\")\\npublic EntityModel<User> getUser(@PathVariable Long id) {\\n    User user = userRepository.findById(id).orElseThrow(ResourceNotFoundException::new);\\n    return EntityModel.of(user, linkTo(methodOn(UserController.class).getUser(id)).withSelfRel());\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Content Negotiation\",\n      \"explanation\": \"Content negotiation allows clients to specify the desired format of the response (e.g., JSON, XML).  Spring Boot automatically handles content negotiation based on the `Accept` header in the request.  You can customize this behavior using `@RequestMapping` with `produces` attribute to specify the supported media types.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)\\npublic ResponseEntity<List<User>> getAllUsers() {\\n    // ...\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Asynchronous REST Controllers with CompletableFuture\",\n      \"explanation\": \"To avoid blocking threads while waiting for long-running operations (like database queries or external API calls), use asynchronous processing with `CompletableFuture`. This improves API responsiveness and scalability.  Spring supports returning `CompletableFuture` from controller methods.\",\n      \"codeExample\": \"<precode>\\n@GetMapping\\npublic CompletableFuture<List<User>> getAllUsers() {\\n    return CompletableFuture.supplyAsync(() -> userRepository.findAll());\\n}\\n</precode>\"\n    }\n  ]\n}\n```\n"},
      ],
    },
  ],
});