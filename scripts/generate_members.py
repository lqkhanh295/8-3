import json
import re

names_text = """
Đặng Ngọc Anh Thư
Trần Khang Nhật Linh
Tạ Khánh Vy
Nguyễn Thanh Hồng Ngân
Phạm Thị Tuyết Nhi
Huỳnh Ngọc Minh Thư
Nguyễn Huỳnh Thanh Liêm
Võ Như Ngọc
Phan Huỳnh Minh Anh
Tạ Ngọc Thanh Thanh
Lê Triệu Vi
Phạm Ngọc Bảo Trâm
Vũ Nguyễn Đoan Nguyên
Trịnh Yến Phương
Lê Tuệ Nhi
Nguyễn Lê Thảo Vy
Trần Thị Tâm
Võ Thanh Trúc
Nguyễn Thị Thảo Nhi
Đỗ Thị Hồng Thắm
Đặng Nguyệt Nhi
Vũ Mai Anh
Nguyễn Thị Thanh Diệu
Nguyễn Thị Huyền Trâm
Huỳnh Thảo Duyên
Nguyễn Phương Thảo
Nguyễn Minh Thư
Lương Phạm Như An
Lê Trần Gia Bảo
Bùi Thị Phương Thảo
Phan Nguyễn Khiết Trân
Lê Thùy Linh
Nguyễn Huỳnh Thanh Liêm
Đặng Nguyễn Hoàng Yến
Trương Nhật Nam
Trần Hiếu Thảo
Bùi Lê Thiên Thanh
Đỗ Hoàn Thiện
Hồ Thị Quỳnh Thy
Hoàng Quỳnh Anh
Trần Nam Phương Vy
Đặng Ngọc Ánh
Nguyễn Thị Bích My
Nguyễn Tường Anh
Phạm Thị Mỹ Linh
Nguyễn Quỳnh Mai
Trần Nguyễn Quế Linh
Hoàng Thị Thanh Hà
Lê Quỳnh Hương
Phạm Huỳnh Anh
Dương Cát Tiên
Bùi Trần Ngọc Trâm
Trương Nguyễn Bảo Trân
Nguyễn Quỳnh Hương
Võ Hoàng Kim Ngân
Phạm Thanh Thảo
Tống Khánh Linh
Lương Hà Minh Anh
Đỗ Phương Thảo
Ngô Thị Ý Nhi
Nguyễn Mai Ngọc Vy
Võ Thuỵ Phương Hà
Hoàng Thị Yến Nhi
Phạm Hải Yến
Nguyễn Thị Hà Ân
Võ Vy Thanh
Phạm Ngọc Tú Anh
"""

def slugify(text):
    text = text.lower()
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'[đ]', 'd', text)
    text = re.sub(r'[^a-z0-9]', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

names = [n.strip() for n in names_text.strip().split('\n') if n.strip()]
unique_names = []
seen = set()
for name in names:
    if name not in seen:
        unique_names.append(name)
        seen.add(name)

messages = [
    "Gửi {name} — người mang lại năng lượng tích cực cho mọi người. Chúc bạn luôn vui vẻ, xinh đẹp và đạt được mọi ước mơ! 🌷",
    "{name} ơi, mỗi sự đóng góp của bạn đều mang lại niềm vui cho CLB. Chúc bạn ngày 8/3 thật nhiều hoa, thật nhiều yêu thương! 🌸",
    "Chúc {name} luôn giữ được ngọn lửa nhiệt huyết và sự tự tin. Ngày 8/3 này, hãy để mình được chiều chuộng nhé! 🌺",
    "Thân gửi {name}, cảm ơn bạn đã luôn đồng hành cùng CLB. Chúc bạn ngày 8/3 tràn đầy niềm vui và những điều bất ngờ! 💫",
    "{name} thân mến, nụ cười của bạn luôn làm sáng cả môi trường làm việc! Chúc bạn ngày Phụ nữ thật đặc biệt! 🌻",
    "Gửi {name}, sự chăm chỉ và nhiệt tình của bạn là nguồn cảm hứng cho mọi người. Chúc bạn ngày 8/3 thật ấm áp và ý nghĩa! 🌿",
    "{name} ơi, chúc bạn ngày 8/3 rạng rỡ như một đóa hoa xuân, luôn tự tin và yêu đời nhé! 🌹",
    "Chúc {name} một ngày 8/3 thật ngọt ngào, nhận được thật nhiều quà và những lời chúc chân thành nhất! 🍬",
    "Gửi tới {name} những lời chúc tốt đẹp nhất. Hãy luôn là cô gái thông minh, mạnh mẽ và đầy bản lĩnh nhé! 💪",
    "Chúc {name} ngày 8/3 tràn ngập tiếng cười, niềm hạnh phúc bên gia đình và những người thân yêu! 🏠",
    "{name} thân yêu, chúc bạn luôn giữ vững phong độ và gặt hái được nhiều thành công hơn nữa trong sự nghiệp! 📈",
    "Ngày 8/3 này, chúc {name} luôn xinh đẹp, trẻ trung và là tâm điểm của mọi sự chú ý! ✨",
    "Gửi {name}, chúc bạn một ngày lễ thật ý nghĩa, đầy ắp những kỷ niệm đẹp và những nụ cười tỏa nắng! ☀️",
    "Chúc {name} luôn là biểu tượng của sự dịu dàng nhưng không kém phần kiên cường trong mắt mọi người! 💎",
    "{name} ơi, hãy cứ rực rỡ theo cách của riêng bạn. Chúc bạn ngày Phụ nữ thật trọn vẹn và hạnh phúc! 🎈"
]

quotes = [
    "Phụ nữ mạnh mẽ không chờ đợi cơ hội, họ tạo ra nó.",
    "Sự dịu dàng không phải là điểm yếu, mà là sức mạnh lớn nhất.",
    "Mỗi cô gái đều là một ngôi sao, chỉ cần tìm đúng bầu trời.",
    "Hãy là phiên bản đẹp nhất của chính mình.",
    "Năng lượng tích cực là món quà đẹp nhất bạn có thể trao đi.",
    "Sáng tạo là cách phụ nữ thay đổi thế giới.",
    "Phụ nữ sinh ra là để được yêu thương và trân trọng.",
    "Sức mạnh của người phụ nữ nằm ở sự kiên tâm và lòng bao dung.",
    "Vẻ đẹp thực sự của người phụ nữ toát ra từ chính tâm hồn cô ấy.",
    "Đừng so sánh mình với bất kỳ ai, hãy cứ tỏa sáng theo cách của bạn.",
    "Thế giới này đẹp hơn nhờ sự hiện diện của những người phụ nữ.",
    "Hãy sống rực rỡ như những đóa hoa, dẫu nắng hay mưa cũng chẳng từ bỏ.",
    "Trí tuệ chính là trang sức lộng lẫy nhất của một người phụ nữ.",
    "Bản lĩnh của người phụ nữ là biết đứng lên sau mỗi lần vấp ngã.",
    "Hạnh phúc là khi bạn được tự do làm những điều mình yêu thích."
]

wishes = [
    "Luôn hạnh phúc và được yêu thương!",
    "Tỏa sáng rực rỡ trên mọi chặng đường!",
    "Đạt được mọi mục tiêu đã đề ra!",
    "Luôn cười thật tươi mỗi ngày!",
    "Gặp thật nhiều may mắn và yêu thương!",
    "Luôn bùng cháy đam mê!",
    "Mãi mãi trẻ trung và rạng ngời!",
    "Vạn sự như ý, tỷ sự như mơ!",
    "Gặt hái được nhiều thành công mới!",
    "Luôn bình yên và tự tại trong tâm hồn!",
    "Mọi điều tốt đẹp nhất sẽ đến với bạn!",
    "Hãy luôn tin tưởng vào chính mình nhé!",
    "Chúc bạn luôn là niềm tự hào của mọi người!",
    "Sức khỏe dồi dào và niềm vui bất tận!",
    "Một ngày 8/3 không thể nào quên!"
]

themes = ["rose", "lavender", "mint", "peach", "sky", "coral"]
emojis = ["🌸", "🌷", "🌺", "🌼", "🌻", "🌿", "🦋", "✨"]

# Tải dữ liệu cũ nếu có để giữ lại các chỉnh sửa thủ công (ví dụ: role, message riêng)
existing_data = {}
try:
    with open(r"d:\CODE\83 yap yap\data\members.json", "r", encoding="utf-8") as f:
        old_list = json.load(f)
        for item in old_list:
            existing_data[item["id"]] = item
except FileNotFoundError:
    pass

members = []
for i, name in enumerate(unique_names):
    member_id = slugify(name)
    
    # Nếu đã có trong data cũ, ưu tiên giữ nguyên một số trường quan trọng
    existing = existing_data.get(member_id, {})
    
    members.append({
        "id": member_id,
        "name": name,
        "role": existing.get("role", "Thành viên"),
        "message": existing.get("message", messages[i % len(messages)].format(name=name)),
        "emoji": existing.get("emoji", emojis[i % len(emojis)]),
        "theme": existing.get("theme", themes[i % len(themes)]),
        "quote": existing.get("quote", quotes[i % len(quotes)]),
        "wish": existing.get("wish", wishes[i % len(wishes)])
    })

with open(r"d:\CODE\83 yap yap\data\members.json", "w", encoding="utf-8") as f:
    json.dump(members, f, ensure_ascii=False, indent=4)
