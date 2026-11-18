const products = [
  {
    id: 1,
    title: "Tài khoản TikTok",
    brand: "TVP Blogger",
    category: "Social",
    image: "./files/shop-optimized/tiktok.jpg",
    price: "Liên Hệ",
    duration: "Vĩnh viễn",
    warranty: "Uy tín",
    
    qr: "./files/zalo.jpg", // Để trống sẽ dùng QR mặc định
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "Tài khoản việt tương tác thật.",
      "Đa dạng loại tài khoản theo nhu cầu.",
      "Full chức năng Live, Tiktok shop đầy đủ.",
      "Bảo mật tuyệt đối, hỗ trợ đổi thông tin.",
      "Sạch sẽ không vi phạm, đều là acc trắng thông tin.",
    ]
  },
  {
    id: 2,
    title: "ChatGPT Plus",
    brand: "TVP Blogger",
    category: "AI",
    image: "./files/shop-optimized/chatgptplus.jpg",
    price: "liên Hệ",
    duration: "Tùy Loại",
    warranty: "Tùy Loại",
    delivery: "5-10 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "GPT PLUS 1 năm chuẩn plus	1 năm	1.800.000	NÂNG TỪ EMAIL BẠN DÙNG ACC	RIÊNG	bảo hành 12  tháng ",
      "GPT PLUS cấp acc	1 tháng	200.000	cấp acc	riêng	bảo hành 1 THÁNG",
      "GPT PLUS 6 THÁNG	1.100.000	NÂNG TỪ EMAIL BẠN	CẤP ACC riêng	BẢO HÀNH FULL",
      "GPT PLUS 3 THÁNG	3 THÁNG	600.000	NÂNG TỪ EMAIL BẠN	ACC RIÊNG	BẢO HÀNH FULL",
      "NGOÀI RA CÒN CÁC GÓI CHATGPT KHÁC LIÊN HỆ ĐỂ ĐƯỢC TƯ VẤN THÊM"
    ]
  },
  {
    id: 3,
    title: "Locket Gold",
    brand: "TVP Blogger",
    category: "Social",
    image: "./files/shop-optimized/locketgold.jpg",
    price: "45.000đ",
    duration: "Vĩnh viễn",
    warranty: "1 năm",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "LOCKET GOLD CAM KẾT KHÔNG DÍNH ICL",
      "Mở khóa Locket Gold vĩnh viễn.",
      "1 thiết bị 1 acc",
      "Hỗ trợ cả 2 nền tảng iOS và Android"
    ]
  },
  {
    id: 4,
    title: "YouTube Premium",
    brand: "TVP Blogger",
    category: "Premium",
    image: "./files/shop-optimized/youtube-premium.jpg",
    price: "28.000đ",
    duration: "Tùy Loại",
    warranty: "Full-time",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "YT PRENIUM ( FAMILY ) tặng kèm 1 gg one 2tb 1 veo3	1 THÁNG	28.000	NÂNG TỪ EMAIL BẠN	RIÊNG	Bảo hành full",
      "YT PRENIUM ( FAMILY ) tặng kèm 1 gg one 2tb 1 veo3	6 tháng	160.000	nâng từ email bạn	riêng	Bảo hành full",
      "YT PRENIUM ( FAMILY ) tặng kèm 1 gg one 2tb 1 veo3	12 tháng	320.000	nâng từ email bạn	riêng	Bảo hành full",
      "Đi kèm YouTube Music Premium."
    ]
  },
  {
    id: 5,
    title: "Gemini Advanced",
    brand: "TVP Blogger",
    category: "AI",
    image: "./files/shop-optimized/gemini.jpg",
    price: "Tùy Loại",
    duration: "Tùy Loại",
    warranty: "1tháng/12tháng/1năm",
    delivery: "5-10 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "GG GEMINI ULTRA 30 NGÀY TẠO VIDEO HẠN 25K CREDIT 1 THÁNG	giá 800.000	Hỗ Trợ 2-3 MÁY	RIÊNG	BẢO HÀNH FULL",
      "GG GEMINI ULTRA 30 NGAY TẠO VIDEO HẠN 25kCREDIT	1 tháng	200.000	Hỗ Trợ 2-3 MÁY	RIÊNG	bảo hành 24h",
      "GEMINI PRO + 5TB DRIVER + notebook lm + call meet không giới hạn CHỦ FAM NÂNG CHÍNH CHỦ	12 THÁNG	400.000	NÂNG CẤP TỪ ACC BẠN LOG BAO MÁY OK DÙNG RIÊNG	BẢO HÀNH FULL",
      "Nâng cấp Google Meet Premium."
    ],
  },
  {
    id: 6,
    title: "CapCut Pro",
    brand: "TVP Blogger",
    category: "Creative",
    image: "./files/shop-optimized/capcut-pro.jpg",
    price: "Tùy Loại",
    duration: "Có Hạn",
    warranty: "Full",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
"Tài khoản CapCut (7 ngày ) đang bán chạy chỉ từ	10.000	2 thiết bị	Riêng	Bảo hành full","Tài khoản CapCut (1 tháng )	77.000	2 thiết bị	Riêng	Bảo hành full",
"Tài khoản capcut (6 tháng) 490.00 bảo hành full",
    ]
  },
  {
    id: 7,
    title: "Canva Pro",
    brand: "TVP Blogger",
    category: "Creative",
    image: "./files/shop-optimized/canva.jpg",
    price: "Tùy Loại",
    duration: "Full",
    warranty: "Full",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "Canva (1 năm) edu tính năng tương tự pro thiếu 1 số cái 1 năm	50.000	NÂNG TỪ EMAIL BẠN	Riêng	bảo hành full",
      "Canva (3 năm ) edu	3 năm	75.000	NÂNG TỪ EMAIL BẠN	Riêng	Bảo hành full",
       "canva pro không phải edu 12 tháng	100.000	NÂNG TỪ EMAIL BẠN	riêng	Bảo hành full",
        "CANVA PRO KHÔNG PHẢI EDU 6 THÁNG	6 THÁNG	50.000	NÂNG TỪ EMAIL BẠN	riêng	Bảo hành full",
        "canva pro không phải edu 1 tháng	1 tháng	10.000	NÂNG TỪ EMAIL BẠN	riêng	Bảo hành full",
    ]
  },
  {
    id: 8,
    title: "Netflix Premium",
    brand: "TVP Blogger",
    category: "Entertainment",
    image: "./files/shop-optimized/netflix.jpg",
    price: "99.000đ",
    duration: "Có Hạn",
    warranty: "Full-time",
    delivery: "5 phút",
     qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "NEXFLIX HÀNG FARM loại standard ( XÀI ĐÔI KHI BỊ OUT )	1 THÁNG	35.000	1 thiết bị	CHUNG	Bảo hành full", 
      "nexFLIX HÀNG FARM loại prenium ( XÀI ĐÔI KHI BỊ OUT )	1 THÁNG	50.000	1 thiết bị	chung	Bảo hành full", 
      "nexflix prenium  giá rẻ dùng cho máy tính và TV, ios ( có thể dùng được các tháng sau )	1 tháng	35.000	3-4 thiết bị	riêng	Bảo hành full",
       "nexflix chính chủ dùng riêng tư ultra HD 4k	1 tháng	88.000	1 thiết bị	riêng	Bảo hành full",
      ]
  },
  {
    id: 9,
    title: "Claude Pro",
    brand: "TVP Blogger",
    category: "AI",
    image: "./files/shop-optimized/claude-pro.jpg",
    price: "380.000đ",
    duration: "1 tháng",
    warranty: "Full 1 tháng",
    delivery: "5-10 phút",
     qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "CLAUDE PRO	1 THÁNG	380.000	NÂNG CẤP TỪ ACC	RIÊNG	BẢO HÀNH FULL 1 THÁNG",
      
      ]
  },
  {
    id: 10,
    title: "Adobe Full App",
    brand: "TVP Blogger",
    category: "Creative",
    image: "./files/shop-optimized/adobe.jpg",
    price: "200.000đ",
    duration: "2 tháng",
    warranty: "Full",
    delivery: "10 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "ADOBE 2 THÁNG 200.000	ACC CẤP	riêng	bảo hành full",  
      "Ngoài ra còn có gói Adobe gói 4 tháng bảo hành full 190k -->đang sale",
      ]
  },
  {
    id: 11,
    title: "Spotify Premium",
    brand: "TVP Blogger",
    category: "Premium",
    image: "./files/shop-optimized/spotify.jpg",
    price: "280.000đ",
    duration: "6 tháng và 12 tháng ",
    warranty: "Full-time",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "SPOTIFY 	12 THÁNG	380.000	nâng chính chủ	RIÊNG	Bảo hành full",
      "SPOTIFY 	6 tháng	280.000	nâng chính chủ	RIÊNG	Bảo hành full",
      ]
  },
  {
    id: 12,
    title: "Microsoft 365",
    brand: "TVP Blogger",
    category: "Productivity",
    image: "./files/shop-optimized/microsoft.jpg",
    price: "180.000đ",
    duration: "1 năm",
    warranty: "Full-time",
    delivery: "10 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "Bộ Office cao cấp (Word, Excel, PowerPoint)",
      "NÂNG CẤP MICROSOFT 1 NĂM 1TB FULL BỘ OFFICE	1 NĂM	180.000	NÂNG TỪ EMAIL BẠN	RIÊNG	Bảo hành full",     
      ]
  },
  {
    id: 13,
    title: "LEonardo.Ai",
    brand: "TVP Blogger",
    category: "Source",
    image: "./files/shop-optimized/leoai.jpg",
    price: "300.000đ",
    duration: "1 tháng",
    warranty: "Bảo Hành Full",
    delivery: "5 phút",
     qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "Leonardo (Artisan Ultimate)	1 tháng	250.000	1 máy	Chung	Bảo hành ful -->đang sale",
       "Leonardo (Gói Meatro)	1 tháng	300.000	1 máy	Chung	Bảo hành full", 
      ]
  },
  {
    id: 14,
    title: "Piscart Pro",
    brand: "TVP Blogger",
    category: "Source",
    image: "./files/shop-optimized/piscart.jpg",
    price: "240.000đ",
    duration: "12 tháng",
    warranty: "3 tháng",
    delivery: "5 phút",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "PISCART PRO 	12 THÁNG	240.000	NÂNG CẤP TỪ ACC	RIÊNG	BẢO HÀNH 3 THÁNG",      
      ]
  },
  {
    id: 15,
    title: "Grok",
    brand: "TVP Blogger",
    category: "Source",
    image: "./files/shop-optimized/grok.jpg",
    price: "250.000đ",
    duration: "1 tháng",
    warranty: "Bảo Hành Full",
    delivery: "10p",
    qr: "./files/zalo.jpg",
    zalo: "https://zalo.me/your-zalo-id",
    features: [
      "GROK SUPER DÙNG RIÊNG 1 THÁNG 250.000	acc cấp	RIÊNG	Bảo hành full",
      ]
  },
 
 
];
