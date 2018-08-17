## Response

Các phản hồi từ API đều phải được trả về theo cấu trúc sau:

```json
{
    "error" : null | { "message" : "Content message", "code" : "CODE_ERROR", "num" : 999 },
    "data" : null | {}
}
```

Trong đó:
- Error : `null` khi không có lỗi gì xảy ra, nếu có lỗi thì trả về một đối tượng chưa các tham thuộc tính: `message`, `code`, `num`.
- Data : `null` khi có lỗi xảy ra, ngược lại sẽ trả về  một dữ liệu tùy vào URL.

## Error Core

| Number | Code | Messsh sage |
|--------|------|---------|
| 0 | SERECT_KEY_NOT_EXIST | Serect Key is not exist. |
| 1 | SERECT_KEY_INVALID | Serect Key invalid. |
| 2 | SERECT_KEY_DISABLED | Serect Key disabled. |
| 3 | IP_SERVER_DENY | IP Server deny. |