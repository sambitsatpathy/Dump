# GitHub Copilot Instructions — Spring Boot Project

> Place this file at `.github/copilot-instructions.md` so Copilot picks it up automatically across the workspace.

---

## Project Overview

This is a **Spring Boot** project. Copilot should generate code that is idiomatic for the Spring ecosystem, production-ready, and consistent with the conventions defined below.

- **Language:** Java 21+
- **Framework:** Spring Boot 3.x
- **Build Tool:** Maven or Gradle (match existing project)
- **Primary Persistence:** Spring Data JPA + Hibernate
- **API Style:** RESTful JSON APIs
- **Testing:** JUnit 5 + Mockito + Spring Boot Test

---

## Architecture Conventions

Follow a layered architecture with strict separation of concerns:

```
Controller  →  Service  →  Repository  →  Database
                ↕
            Domain Model (Entities, DTOs, Exceptions)
```

| Layer | Package | Responsibility |
|-------|---------|----------------|
| `controller` | `*.controller` | HTTP request/response, input validation |
| `service` | `*.service` | Business logic, transactions |
| `repository` | `*.repository` | Data access via Spring Data JPA |
| `domain/entity` | `*.domain` | JPA entities |
| `dto` | `*.dto` | Request/Response transfer objects |
| `exception` | `*.exception` | Custom exceptions + global handler |
| `config` | `*.config` | Beans, security, OpenAPI config |
| `mapper` | `*.mapper` | DTO ↔ Entity mapping (MapStruct preferred) |

---

## Code Generation Rules

### Controllers
- Annotate with `@RestController` and `@RequestMapping("/api/v1/resource")`
- Use `ResponseEntity<T>` as return type for all endpoints
- Validate inputs with `@Valid` and Bean Validation annotations (`@NotNull`, `@Size`, etc.)
- Keep controllers thin — delegate all logic to the service layer
- Document endpoints with `@Operation` and `@ApiResponse` from SpringDoc OpenAPI

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "User found")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }
}
```

### Services
- Annotate with `@Service`
- Use `@Transactional` at the class or method level — read-only methods use `@Transactional(readOnly = true)`
- Throw domain-specific exceptions (never raw `RuntimeException`)
- Inject dependencies via constructor (use Lombok `@RequiredArgsConstructor`)

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        User user = userMapper.toEntity(request);
        return userMapper.toResponse(userRepository.save(user));
    }
}
```

### Repositories
- Extend `JpaRepository<Entity, ID>`
- Name derived query methods following Spring Data conventions
- Use `@Query` (JPQL) only when derived queries become unreadable
- Never put business logic inside repositories

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.status = :status ORDER BY u.createdAt DESC")
    Page<User> findByStatus(@Param("status") UserStatus status, Pageable pageable);
}
```

### Entities
- Annotate with `@Entity` and `@Table(name = "table_name")`
- Always define `@Id` with `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- Use `@CreationTimestamp` and `@UpdateTimestamp` for audit fields
- Use `@Enumerated(EnumType.STRING)` for enum columns
- Avoid bidirectional relationships unless strictly necessary (prevents N+1 issues)

```java
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### DTOs
- Separate Request and Response DTOs — never expose entities directly
- Use Java Records for immutable DTOs when possible
- Apply Bean Validation on request DTOs

```java
// Request
public record CreateUserRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    @NotBlank String name
) {}

// Response
public record UserResponse(
    Long id,
    String email,
    String name,
    UserStatus status,
    LocalDateTime createdAt
) {}
```

### Exception Handling
- Define a `GlobalExceptionHandler` annotated with `@RestControllerAdvice`
- Create domain-specific exceptions extending `RuntimeException`
- Return a consistent `ErrorResponse` object for all errors

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", message));
    }
}
```

---

## Testing Rules

- Unit test every `@Service` method using `@ExtendWith(MockitoExtension.class)`
- Integration test every `@RestController` using `@WebMvcTest` + MockMvc
- Repository tests use `@DataJpaTest` with an in-memory H2 database
- Full integration tests use `@SpringBootTest(webEnvironment = RANDOM_PORT)` + Testcontainers
- Test method naming pattern: `methodName_scenario_expectedResult`

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    void getById_whenUserExists_returnsUserResponse() {
        // Arrange
        User user = new User();
        UserResponse expected = new UserResponse(1L, "test@example.com", "Test", UserStatus.ACTIVE, LocalDateTime.now());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(expected);

        // Act
        UserResponse result = userService.getById(1L);

        // Assert
        assertThat(result).isEqualTo(expected);
    }

    @Test
    void getById_whenUserNotFound_throwsResourceNotFoundException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> userService.getById(99L))
            .isInstanceOf(ResourceNotFoundException.class);
    }
}
```

---

## Anti-Patterns — Copilot Must NOT Generate

- **No `@Autowired` on fields** — use constructor injection only (`@RequiredArgsConstructor`)
- **No business logic in controllers or repositories**
- **No entity classes returned directly from controllers** — always use DTOs
- **No `catch (Exception e) { e.printStackTrace(); }`** — use proper exception handling
- **No `Optional.get()` without checking presence** — use `.orElseThrow()`
- **No raw `EntityManager` queries** when Spring Data JPA suffices
- **No `@Transactional` on repository methods** — it's already managed
- **No hardcoded values** — use `@Value` or `@ConfigurationProperties`
- **No `System.out.println`** — use SLF4J + Logback (`private static final Logger log = LoggerFactory.getLogger(...)`)

---

## Configuration

- Use `application.yml` (preferred over `.properties`)
- Separate profiles: `dev`, `test`, `prod`
- Sensitive values (passwords, API keys) must use environment variable placeholders: `${ENV_VAR_NAME}`

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/mydb}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    com.mycompany: INFO
```

---

## Dependency Preferences

| Concern | Preferred Library |
|---------|------------------|
| Boilerplate reduction | Lombok |
| DTO ↔ Entity mapping | MapStruct |
| API documentation | SpringDoc OpenAPI (`springdoc-openapi-starter-webmvc-ui`) |
| Database migrations | Flyway |
| Testing assertions | AssertJ |
| Integration test DB | Testcontainers |
| Security | Spring Security + JWT (or OAuth2 Resource Server) |

---

## Available Skills

The following Claude skills are available in this project to assist with specific tasks. Use the appropriate skill when the situation applies.

---

### `copilot-frontend-design` — Salt DS UI Generation

**When to use:** Any time a frontend UI component, page, dashboard, or web interface needs to be built alongside this Spring Boot backend — particularly when using J.P. Morgan's Salt Design System (`@salt-ds/core`).

**What it does:**
- Generates production-grade React + Salt DS components with correct density/mode configuration
- Produces `SaltProvider` setup, layout primitives (`StackLayout`, `GridLayout`), and form controls
- Enforces Salt DS token usage — never hardcoded hex colors or raw flexbox
- Outputs both a `.github/copilot-instructions.md` frontend block and a per-component Copilot Chat prompt

**Trigger phrases:** "build a dashboard", "create a form component", "UI for this endpoint", "Salt DS", "frontend page"

---

### `copilot-image-parser` — Screenshot/Diagram to Copilot Context

**When to use:** Any time you have an image (architecture diagram, ERD, wireframe, whiteboard, code screenshot, error/stack trace) that you want Copilot to act on — since Copilot cannot read images directly.

**What it does:**
- Classifies the image type (UI mockup, architecture diagram, ERD, flowchart, code screenshot, data table, error trace)
- Extracts structured text context in the appropriate format (component tree, SQL schema, dependency map, pseudocode, etc.)
- Delivers a ready-to-paste `# === COPILOT IMAGE CONTEXT ===` block
- Includes a suggested Copilot prompt to send alongside the extracted context

**Trigger phrases:** "here's a diagram", "parse this screenshot", "convert this ERD", "Copilot can't read images", "extract from this image"

---

### `copilot-context-reducer` — Token Compression for Large Codebases

**When to use:** When the Spring Boot codebase has grown large and pasting too many files into Copilot Chat exceeds the context window, produces low-quality responses, or feels sluggish.

**What it does:**
- Inventories all files by relevance to the current task (focal, supporting, transitive, unrelated)
- Applies layered compression: strip comments → stub bodies → signatures only → module summary → dependency map
- Targets a default budget of ~4,000 tokens and reports before/after token estimates
- Flags anything non-obvious that was dropped so you can add it back if needed
- Especially useful for Java: collapses getter/setter pairs, removes `@Autowired` import blocks, stubs unrelated service methods

**Trigger phrases:** "too much context", "context window limit", "compress before sending", "summarize for Copilot", "token limit"

---

## Quick Reference — Common Copilot Prompts for Spring Boot

**Generate a full CRUD feature:**
> "Generate a full Spring Boot CRUD feature for `[Entity]`. Include: JPA entity, JPA repository, service with `@Transactional`, REST controller at `/api/v1/[entities]`, request/response DTOs as Java records, and a `ResourceNotFoundException`. Follow the project's layered architecture."

**Add pagination to an endpoint:**
> "Add `Pageable` support to `GET /api/v1/[entities]`. Return a `Page<[Entity]Response>` from the service and a `PagedModel` from the controller using Spring HATEOAS."

**Write unit tests for a service:**
> "Write JUnit 5 + Mockito unit tests for `[ServiceName]`. Cover: happy path, not-found exception, and any validation edge cases. Use AssertJ assertions and the naming pattern `method_scenario_expectedResult`."

**Add Flyway migration:**
> "Create a Flyway migration script `V[N]__[description].sql` to add the `[table_name]` table matching the `[Entity]` JPA entity definition."

**Add Spring Security JWT filter:**
> "Add a JWT authentication filter to this Spring Boot project. Use `OncePerRequestFilter`, validate the token in `Authorization: Bearer <token>` header, and set the `SecurityContextHolder` on success."
