---
name: springboot-code-review
description: >
  Performs exhaustive, opinionated code reviews for Spring Boot projects using JDK 17,
  PostgreSQL, and MyBatis XML mappers. Use this skill whenever someone asks to review,
  audit, check, or critique Spring Boot code, Java classes, XML mappers, repository layers,
  service layers, REST controllers, PostgreSQL queries, or any component of a Spring Boot
  application. Also trigger for questions like "is this good practice?", "what's wrong with
  this code?", "how should I structure this?", or "can you improve this?" in a Spring Boot
  context. Always use this skill even if the user only shares a single file or snippet.
---

# Spring Boot Code Review Skill
## Stack: Spring Boot · JDK 17 · PostgreSQL · MyBatis XML Mapper

---

## How to Perform the Review

Always review in this order. Never skip a category. For each finding state:
- **Severity**: `CRITICAL` / `MAJOR` / `MINOR` / `SUGGESTION`
- **Location**: Class, method, or file name
- **Issue**: What is wrong
- **Fix**: The corrected code or pattern

---

## 1. JDK 17 Compliance

### 1.1 Use JDK 17 Features Where Appropriate
- **Records** for immutable DTOs and value objects — not plain POJOs with Lombok
  ```java
  // BAD
  @Data
  public class UserDto { private String name; private String email; }

  // GOOD
  public record UserDto(String name, String email) {}
  ```
- **Sealed classes** for discriminated domain types (e.g. result types, event types)
- **Pattern matching `instanceof`** — never cast without pattern matching
  ```java
  // BAD
  if (obj instanceof String) { String s = (String) obj; }

  // GOOD
  if (obj instanceof String s) { ... }
  ```
- **Text blocks** for multiline strings (SQL in Java, JSON templates)
  ```java
  // BAD
  String sql = "SELECT u.id, u.name " +
               "FROM users u " +
               "WHERE u.active = true";

  // GOOD
  String sql = """
      SELECT u.id, u.name
      FROM users u
      WHERE u.active = true
      """;
  ```
- **Switch expressions** over switch statements where value is returned
- **`var`** allowed for local variables with obvious types — not for method parameters or fields

### 1.2 Banned Patterns in JDK 17
- No raw types (`List` instead of `List<String>`)
- No `StringBuffer` — use `StringBuilder`
- No `new Integer(x)` — use `Integer.valueOf(x)` or autoboxing
- No null returns from methods that can return `Optional`
- Prefer `Optional` over nullable return types in service/repository interfaces

---

## 2. Spring Boot Architecture

### 2.1 Layer Separation (CRITICAL if violated)
Enforce strict layering — never cross layers:

```
Controller → Service → Repository → DB
```

- **Controllers**: HTTP only. No business logic, no SQL, no direct repository calls
- **Services**: All business logic here. Must be `@Transactional` where needed
- **Repositories**: Data access only. No business logic
- **No `@Autowired` on fields** — constructor injection only

```java
// BAD — field injection
@Service
public class UserService {
    @Autowired
    private UserRepository repo;
}

// GOOD — constructor injection
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
}
```

### 2.2 Controller Rules
- Must be annotated `@RestController` for REST APIs
- Use `@RequestMapping` at class level for base path
- Every endpoint must return `ResponseEntity<T>` — never raw objects
- Validate input with `@Valid` and Jakarta Bean Validation annotations
- No try-catch in controllers — use `@ControllerAdvice`

```java
// BAD
@PostMapping("/users")
public User createUser(@RequestBody User user) {
    return userService.create(user);
}

// GOOD
@PostMapping("/users")
public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
}
```

### 2.3 Service Rules
- Interface + Implementation pattern required for all services with complex logic
- `@Transactional` on write operations, `@Transactional(readOnly = true)` on reads
- Never expose entities from service layer — always map to DTOs
- Never catch and silently swallow exceptions

### 2.4 Exception Handling
- Global handler via `@ControllerAdvice` + `@ExceptionHandler`
- Custom exception hierarchy extending `RuntimeException`
- All exceptions must produce a structured error response body:
  ```java
  public record ErrorResponse(String code, String message, Instant timestamp) {}
  ```
- HTTP status must match: 404 for not found, 400 for validation, 409 for conflict, 500 for unexpected

---

## 3. MyBatis XML Mapper Review

### 3.1 Mapper Interface Rules
- Must be annotated `@Mapper`
- Must have a 1:1 corresponding XML file in `resources/mappers/`
- Never mix XML and annotation-based SQL on the same mapper
- Method names must clearly describe the operation

```java
// BAD
@Mapper
public interface UserMapper {
    @Select("SELECT * FROM users WHERE id = #{id}") // mixing annotations with XML
    User getUser(Long id);
}

// GOOD
@Mapper
public interface UserMapper {
    User findById(Long id);
    List<User> findAllActive();
    int insert(User user);
    int update(User user);
    int deleteById(Long id);
}
```

### 3.2 XML Mapper File Rules

#### Namespace
- Must exactly match the fully qualified mapper interface name
```xml
<!-- BAD -->
<mapper namespace="UserMapper">

<!-- GOOD -->
<mapper namespace="com.example.project.mapper.UserMapper">
```

#### ResultMap — REQUIRED for all queries
- Never use `resultType` for complex objects — always `resultMap`
- Define `<resultMap>` at the top of the XML file
- Use `<association>` for nested single objects, `<collection>` for nested lists
- Always define `id` column explicitly

```xml
<!-- BAD -->
<select id="findById" resultType="com.example.User">
    SELECT * FROM users WHERE id = #{id}
</select>

<!-- GOOD -->
<resultMap id="userResultMap" type="com.example.User">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="email" column="email"/>
    <result property="createdAt" column="created_at"/>
    <association property="role" javaType="com.example.Role">
        <id property="id" column="role_id"/>
        <result property="name" column="role_name"/>
    </association>
</resultMap>

<select id="findById" resultMap="userResultMap">
    SELECT u.id, u.name, u.email, u.created_at,
           r.id as role_id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = #{id}
</select>
```

#### Parameter Handling
- Always use `#{param}` — never `${param}` (SQL injection risk — CRITICAL)
- Use `@Param` annotation when mapper method has multiple parameters
- Use `parameterType` explicitly for insert/update

```xml
<!-- CRITICAL: SQL Injection -->
<select id="findByName" resultMap="userResultMap">
    SELECT * FROM users WHERE name = '${name}'  <!-- BAD -->
    SELECT * FROM users WHERE name = #{name}    <!-- GOOD -->
</select>
```

#### Dynamic SQL
- Use `<if>`, `<choose>`, `<when>`, `<otherwise>` for conditional logic
- Always wrap multiple conditions in `<where>` tag — never hardcode `WHERE 1=1`
- Use `<set>` tag for UPDATE statements to avoid trailing commas
- Use `<foreach>` for IN clauses — never string concatenate

```xml
<!-- BAD -->
<select id="search" resultMap="userResultMap">
    SELECT * FROM users WHERE 1=1
    <if test="name != null"> AND name = #{name} </if>
</select>

<!-- GOOD -->
<select id="search" resultMap="userResultMap">
    SELECT u.id, u.name, u.email
    FROM users u
    <where>
        <if test="name != null and name != ''">
            AND u.name = #{name}
        </if>
        <if test="active != null">
            AND u.active = #{active}
        </if>
    </where>
</select>

<!-- BAD update -->
<update id="update">
    UPDATE users SET name = #{name}, email = #{email} WHERE id = #{id}
</update>

<!-- GOOD update — only sets non-null fields -->
<update id="update" parameterType="com.example.User">
    UPDATE users
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="email != null">email = #{email},</if>
        updated_at = NOW()
    </set>
    WHERE id = #{id}
</update>
```

#### Batch Operations
- Use `<foreach>` with `executorType="BATCH"` for bulk inserts
```xml
<insert id="insertBatch" parameterType="java.util.List">
    INSERT INTO users (name, email, created_at)
    VALUES
    <foreach collection="list" item="user" separator=",">
        (#{user.name}, #{user.email}, NOW())
    </foreach>
</insert>
```

#### SQL Fragments
- Extract repeated SQL into `<sql>` fragments — never duplicate column lists
```xml
<sql id="userColumns">
    u.id, u.name, u.email, u.active, u.created_at
</sql>

<select id="findAll" resultMap="userResultMap">
    SELECT <include refid="userColumns"/>
    FROM users u
    WHERE u.active = true
</select>
```

---

## 4. PostgreSQL Query Review

### 4.1 Query Correctness
- Never use `SELECT *` — always list explicit columns (MAJOR)
- Always alias tables in joins
- Use `COALESCE` for nullable columns that need defaults
- Use `LIMIT` on all queries that can return large result sets
- Use `RETURNING` clause for INSERT/UPDATE when you need the result back

### 4.2 Index Awareness
- Any column used in `WHERE`, `JOIN ON`, or `ORDER BY` should have an index
- Flag queries filtering on unindexed columns as MAJOR
- Prefer `= ` over `LIKE '%value'` (can't use index)
- `LIKE 'value%'` is OK — `LIKE '%value'` is not

### 4.3 PostgreSQL-Specific Best Practices
- Use `SERIAL` or `BIGSERIAL` for surrogate keys (or `UUID` if distributed)
- Use `TIMESTAMPTZ` not `TIMESTAMP` — always store timezone-aware timestamps
- Use `JSONB` not `JSON` for JSON columns
- Use `TEXT` over `VARCHAR(n)` unless there's a hard constraint
- Use PostgreSQL enums or check constraints for status fields — not magic strings

### 4.4 N+1 Query Detection (CRITICAL)
Flag any pattern where a loop calls the repository:
```java
// CRITICAL: N+1
List<User> users = userMapper.findAll();
users.forEach(u -> u.setOrders(orderMapper.findByUserId(u.getId())));

// GOOD: single join query with collection resultMap
List<User> users = userMapper.findAllWithOrders();
```

### 4.5 Pagination
- Use LIMIT/OFFSET for simple pagination
- Use keyset/cursor pagination for large datasets
- Always pair with an ORDER BY
```xml
<select id="findPage" resultMap="userResultMap">
    SELECT <include refid="userColumns"/>
    FROM users u
    ORDER BY u.id ASC
    LIMIT #{size} OFFSET #{offset}
</select>
```

---

## 5. Transaction Management

- `@Transactional` belongs on the **service** layer, never repository or controller
- `readOnly = true` on all read operations — enables PostgreSQL read replica routing
- Specify `rollbackFor` explicitly for checked exceptions
- Never catch an exception inside a `@Transactional` method and swallow it — this prevents rollback

```java
// BAD
@Transactional
public void createUser(CreateUserRequest request) {
    try {
        userMapper.insert(request);
    } catch (Exception e) {
        log.error("error"); // swallowed — transaction won't roll back
    }
}

// GOOD
@Transactional(rollbackFor = Exception.class)
public UserDto createUser(CreateUserRequest request) {
    userMapper.insert(userMapper);
    return mapToDto(user);
}
```

---

## 6. Security Review

### 6.1 SQL Injection
- Flag ANY `${}` usage in XML mappers as CRITICAL
- Flag string concatenation in queries as CRITICAL

### 6.2 Sensitive Data
- Passwords must never appear in logs — check `toString()` / `@Data` on entities with password fields
- Annotate sensitive fields with `@JsonIgnore` if they exist on response objects
- Mask PII in log statements

### 6.3 Input Validation
- All controller request bodies must use `@Valid`
- All path variables and request params must be validated
- Use Bean Validation constraints: `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`

```java
// BAD
@PostMapping
public ResponseEntity<UserDto> create(@RequestBody CreateUserRequest request) { ... }

// GOOD
@PostMapping
public ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest request) { ... }

public record CreateUserRequest(
    @NotBlank String name,
    @Email @NotBlank String email,
    @Size(min = 8) String password
) {}
```

---

## 7. Code Quality

### 7.1 Naming Conventions
- Classes: `PascalCase`
- Methods/fields: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- DB columns in XML: `snake_case` mapped to `camelCase` Java fields
- Mapper methods: `findBy*`, `insert*`, `update*`, `delete*` — consistent verb prefixes

### 7.2 Logging
- Use SLF4J + Logback — never `System.out.println`
- Use parameterized logging — never string concatenation in log calls
- Log at the right level: DEBUG for internals, INFO for business events, WARN for recoverable issues, ERROR for failures
```java
// BAD
log.info("User created: " + user.getId());

// GOOD
log.info("User created with id={}", user.getId());
```

### 7.3 Magic Numbers and Strings
- No hardcoded strings for statuses, types, or codes — use enums or constants
- No hardcoded numbers — extract to named constants

### 7.4 Null Safety
- Never return `null` from a public method — use `Optional<T>`
- Annotate parameters with `@NonNull` / `@Nullable` where applicable
- Use `Objects.requireNonNull` for defensive checks in constructors

---

## 8. Review Output Format

Structure your review output exactly as follows:

```
## Code Review: [ClassName or File]

### Summary
[2-3 sentence overall assessment]

### Critical Issues (must fix before merge)
[List each with severity, location, issue, fix]

### Major Issues (should fix)
[List each with severity, location, issue, fix]

### Minor Issues (nice to fix)
[List each]

### Suggestions (optional improvements)
[List each]

### Positives
[What was done well — always include at least 1-2]

### Verdict
[ ] Approved  [ ] Approved with minor changes  [ ] Requires changes  [ ] Rejected
```

---

## Quick Reference Checklist

Before finishing any review, confirm all of these have been checked:

- [ ] No `SELECT *` in any XML mapper
- [ ] No `${}` parameter interpolation (SQL injection)
- [ ] All mappers use `<resultMap>` not `resultType` for entities
- [ ] Constructor injection only — no `@Autowired` on fields
- [ ] Controllers return `ResponseEntity<T>` only
- [ ] `@Valid` on all controller request bodies
- [ ] `@Transactional` on service layer only
- [ ] No business logic in controllers or repositories
- [ ] No N+1 query patterns
- [ ] No null returns from public service methods — use `Optional`
- [ ] JDK 17 features used where appropriate (records, pattern matching, text blocks)
- [ ] No swallowed exceptions inside `@Transactional` methods
- [ ] Sensitive fields not exposed in logs or responses
- [ ] Pagination applied to unbounded queries
- [ ] Timestamps use `TIMESTAMPTZ` in PostgreSQL
