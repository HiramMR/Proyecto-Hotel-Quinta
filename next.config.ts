import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = {
  images: {
    remotePatterns: [new URL ('https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/615280862_122111746593156061_3912196455499954122_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeFlwMyVzMWh7Q0-Q3QgvD_-10j_04sPZ5nXSP_Tiw9nmYPjczFRAzIeN3zHGbtMHmzAH4FXLz8XPmCLRB8CmTbO&_nc_ohc=aijKVwecQN0Q7kNvwFw2yr2&_nc_oc=AdpzmBhhnlin11iiqP3-1Kpdg_FGU2eJLDSie-oSzSJxb7XOuaE-0IIxZgfHRF_EZZR8tPt0lCf-wS3fcwZu7Squ&_nc_zt=23&_nc_ht=scontent-qro1-1.xx&_nc_gid=Ao1jQQjqmnSQZH2An1xJQw&_nc_ss=7a32e&oh=00_AfwWU_fW30lvqElvjKOiZD7AGz7KQHAJPJ_-Fq5lAQie4w&oe=69C53FCD')],
  }
}

export default nextConfig;