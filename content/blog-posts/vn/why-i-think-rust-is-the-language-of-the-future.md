---
title: "Tại sao tôi nghĩ Rust là ngôn ngữ của tương lai"
date: "25-05-2026"
excerpt: "Mình từng nghĩ con gái khó hiểu, cho đến khi gặp Rust."
tags:
  - Rust
  - Ý kiến
  - Lập trình 
---

# Rust và ấn tượng đầu tiên

Rust là một ngôn ngữ khá thú vị, và cũng có thể là một nỗi đau đối với rất nhiều người.

Lúc đầu mình biết đến Rust cũng giống như phần lớn lập trình viên khác, thông qua những câu đùa về borrow checker, compiler "khó tính", và những đoạn meme kiểu như "đấu tranh với Ownership đến 3 giờ sáng". Khi đó mình không thật sự hiểu tại sao mọi người lại vừa yêu vừa ghét nó đến vậy.

Mình từng nghĩ:

> "Tại sao phải phức tạp hóa mọi thứ như vậy trong khi Java hay Python làm đơn giản hơn rất nhiều?"

Khi viết Java, mình ít phải nghĩ quá nhiều về chuyện dữ liệu đang nằm ở đâu, ai sở hữu nó hay nó sẽ bị giải phóng lúc nào. Python thì còn thoải mái hơn nữa. Viết xong là chạy, có lỗi thì sửa tiếp.

Rust lại khác.

Nó giống kiểu một người cùng phòng cực kỳ khó tính. Bạn làm sai một chút là bị nhắc ngay. Có những lúc mình chỉ muốn viết một thứ rất đơn giản, nhưng compiler lại hiện ra cả một bức tường lỗi khiến mình tự hỏi: liệu mình có đang đánh nhau với máy tính hay không.

Nhưng càng dùng lâu hơn, mình càng nhận ra compiler của Rust không cố làm khó mình.

Nó chỉ đang cố ngăn mình làm điều gì đó ngu ngốc ><.

# Rust đang cố giải quyết điều gì?

Phần mềm hiện đại ngày càng phức tạp hơn. Người dùng muốn chương trình nhanh hơn, ổn định hơn, tận dụng được nhiều tài nguyên phần cứng hơn và ít lỗi hơn. Nhưng càng tiến gần xuống mức hiệu năng thấp tầng thì càng xuất hiện nhiều vấn đề khó chịu.

Có những lỗi không xuất hiện ngay lập tức. Có những lỗi chỉ xảy ra sau vài tiếng chạy chương trình. Có những lỗi mà chỉ cần một dòng code nhỏ sai đi là đủ biến cả buổi tối thành một cuộc săn bug tuyệt vọng.

Rust được xây dựng để giải quyết một phần rất lớn của những vấn đề đó. 

# Điều khiến mình hứng thú với Rust

Với cả, điều làm mình hứng thú với Rust thật ra không phải chỉ một thứ.

Mình thích việc nó nhanh. Mình thích việc nó cố giải quyết những vấn đề liên quan đến memory safety ngay từ lúc compile. Mình thích cách nó tiếp cận concurrency. Và mình cũng thích việc ngày càng có nhiều công ty lớn bắt đầu sử dụng Rust trong những hệ thống thực tế.

Có một cảm giác khá thú vị khi nhìn thấy một ngôn ngữ tương đối mới dần xuất hiện ở nhiều nơi hơn. Linux kernel bắt đầu hỗ trợ Rust. Những công ty công nghệ lớn đầu tư vào nó. Ngày càng có nhiều thư viện và công cụ được xây dựng xung quanh hệ sinh thái này.

# Ownership thay đổi cách mình suy nghĩ

Và thứ làm mình thay đổi nhất đó là cách Rust nhìn nhận về Ownership rất nhất quán.

Ban đầu thì... mình khá là ghét nó.

Mình không hiểu tại sao compiler lại không cho mình làm những thứ tưởng như rất bình thường. Tại sao biến này lại bị move. Tại sao borrow chỗ này lại lỗi. Tại sao chỉ sửa một dòng code thôi mà cả đống lỗi khác xuất hiện.

Nhưng sau một khoảng thời gian, mình nhận ra Rust đang ép mình phải suy nghĩ kỹ hơn.

Dữ liệu này thuộc về ai.

Ai được phép thay đổi nó.

Nó còn tồn tại ở thời điểm này không.

Những câu hỏi đó nghe có vẻ nhỏ, nhưng nó khiến mình thay đổi cách viết code, không chỉ trong Rust mà cả ở những ngôn ngữ khác.

# Cargo và hệ sinh thái quá tốt

Một thứ nữa mà mình cực kỳ thích là Cargo.

Có những công nghệ bạn dùng và cảm thấy mọi thứ được ghép lại rất hợp lý. Cargo đem lại cho mình cảm giác đó. Việc quản lý dependency, build project, format code hay chạy test đều khá gọn gàng và thống nhất.

Nó tạo cảm giác như cả hệ sinh thái được xây dựng để làm việc cùng nhau thay vì bị chắp vá.

# Rust có phải là tương lai?

Liệu Rust có phải ngôn ngữ của tương lai không?

Mình nghĩ Rust có thể, có thể và có thể thay thế đa số, những vẫn tùy thuộc vào lĩnh vực.

Python thì sẽ vẫn mạnh.

Java sẽ vẫn tồn tại mặc dù ai cũng ghét nó.

C++ sẽ không biến mất chỉ sau một đêm.

Nhưng mình nghĩ Rust đang đi đúng hướng.

Trong một thế giới mà phần mềm ngày càng cần hiệu năng cao hơn, ổn định hơn và tận dụng tài nguyên tốt hơn, mình nghĩ những ý tưởng mà Rust đang theo đuổi sẽ ngày càng trở nên quan trọng.

Có thể tương lai không phải là "mọi người đều dùng Rust".

Nhưng mình nghĩ tương lai chắc chắn sẽ có Rust ở trong đó.

Hoặc ít nhất, đó là một tương lai mà mình muốn tiếp tục học hỏi và khám phá. Nếu bạn có hỏi tôi nên bắt đầu từ ngôn ngữ nào, thì biết câu trả lời rồi đấy: Rust 🦀

---

Hmm, tôi nên ghi Blog xưng hô mình hay tôi đây nhỉ? Có nên chú trọng vào tính cá nhân hay là văn phong đây..