"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const ThaiText = {
  searchPlaceholder: "ค้นหาสินค้า",
  quickSearch: "ค้นหาด่วน",
  login: "Log in",
  latest: "ล่าสุด",
  popular: "สินค้ายอดนิยม / แนะนำ",
  exclusive: "Xclusive Deal",
  collections: "Collections",
  collectionAll: "คอลเลคชันทั้งหมด",
  collectionDesc:
    "ค้นหาแรงบันดาลใจ ผ่านการออกแบบ\nและคัดสรรวัสดุที่น่าสนใจไว้ด้วยกัน",
  partners: "ร้านค้าที่ร่วมขายกับเรา",
  viewAll: "สินค้าทั้งหมด",
  discover: "ค้นหาสินค้า",
  createAccount: "ลงทะเบียนกับเรา",
};

const navItems = [
  { label: "คอลเลคชัน", icon: "grid" },
  { label: "แมทท์เรียลลามิเนต", icon: "layers" },
  { label: "แมทท์เรียลบอร์ด", icon: "cube" },
  { label: "ตะกร้า", icon: "cart" },
  { label: "โปรไฟล์", icon: "user" },
];

const fallbackCategories: Category[] = [
  {
    _id: "cat-laminate",
    name: "Laminate",
    slug: "laminate",
  },
  {
    _id: "cat-tile",
    name: "Tile",
    slug: "tile",
  },
  {
    _id: "cat-stone",
    name: "Stone",
    slug: "stone",
  },
  {
    _id: "cat-wood",
    name: "Wood",
    slug: "wood",
  },
  {
    _id: "cat-mirror",
    name: "Mirror",
    slug: "mirror",
  },
  {
    _id: "cat-wpc",
    name: "WPC",
    slug: "wpc",
  },
  {
    _id: "cat-metal",
    name: "Metal",
    slug: "metal",
  },
  {
    _id: "cat-all",
    name: "All Product",
    slug: "all-product",
  },
];

const latestFallback: Product[] = Array.from({ length: 6 }).map((_, index) => ({
  _id: `latest-${index + 1}`,
  name: `Product name ${index + 1}`,
  code: `CODE${index + 1}`,
  price: 550,
}));

const partnerLogos = Array.from({ length: 7 }).map((_, index) => `Partner ${index + 1}`);

const Page = styled.main`
  background: #f5f3ef;
  color: #1b1a17;
`;

const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const TopInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
`;

const LogoDiamond = styled.span<{ $accent?: boolean }>`
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid ${({ $accent }) => ($accent ? "#e74031" : "#1b1a17")};
  transform: rotate(45deg);
  border-radius: 3px;
`;

const BrandText = styled.span`
  font-size: 14px;
  letter-spacing: 0.2em;
  display: inline-flex;
  gap: 2px;
`;

const BrandX = styled.span`
  color: #e74031;
`;

const Search = styled.div`
  flex: 1 1 360px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #faf9f7;
  border-radius: 999px;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SearchIcon = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid #5c554f;
  border-radius: 50%;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    width: 7px;
    height: 2px;
    background: #5c554f;
    bottom: -4px;
    right: -3px;
    transform: rotate(45deg);
    border-radius: 999px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  width: 100%;
`;

const SearchButton = styled.button`
  border: none;
  background: #ffe9e7;
  color: #e74031;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const NavItems = styled.nav`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: center;
  }
`;

const NavItem = styled.div`
  display: grid;
  gap: 6px;
  justify-items: center;
  font-size: 11px;
  color: #4b4741;
  min-width: 60px;
`;

const NavIcon = styled.span`
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  color: #3e3a35;
`;

const DotsButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #ffffff;
  font-weight: 700;
  letter-spacing: 0.2em;
  cursor: pointer;
`;

const LoginButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 999px;
  background: #e74031;
  color: #ffffff;
  font-weight: 600;
  text-decoration: none;
  font-size: 12px;
`;

const Banner = styled.section`
  background: #dadada;
  min-height: 320px;
  display: grid;
  place-items: center;
  position: relative;
`;

const BannerText = styled.h1`
  margin: 0;
  font-size: clamp(36px, 6vw, 72px);
  letter-spacing: 0.08em;
  color: #ffffff;
  text-align: center;
`;

const BannerSubtitle = styled.div`
  font-size: clamp(20px, 4vw, 36px);
  color: #fefefe;
  margin-top: 16px;
`;

const SliderDots = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
`;

const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
`;

const Dot = styled.span<{ $active?: boolean }>`
  width: ${({ $active }) => ($active ? "22px" : "14px")};
  height: 3px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#d93d31" : "#9b9b9b")};
`;

const LatestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

const SliderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(231, 64, 49, 0.6);
  background: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #e74031;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;


const CategoryRow = styled.section`
  background: #ffffff;
  padding: 28px 20px 40px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 18px;
  text-align: center;
`;

const CategoryItem = styled.div`
  display: grid;
  gap: 10px;
  justify-items: center;
  font-size: 12px;
  color: #4b4741;
`;

const CategoryIcon = styled.div`
  width: 74px;
  height: 74px;
  margin: 0 auto;
  border-radius: 18px;
  background: #f2efed;
`;

const Section = styled.section`
  padding: 32px 20px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const ViewAll = styled(Link)`
  font-size: 12px;
  text-decoration: none;
  color: #d93d31;
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 16px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(Link)`
  display: grid;
  gap: 10px;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid rgba(231, 64, 49, 0.6);
    outline-offset: 4px;
    border-radius: 16px;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  background: #f3efee;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
`;

const ProductPhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductName = styled.div`
  font-size: 12px;
  color: #4b4741;
`;

const ProductPrice = styled.div`
  font-weight: 700;
  font-size: 13px;
`;

const CarouselShell = styled.div`
  position: relative;
  background: #ffffff;
  padding: 32px 0 40px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50%;
    background: #c7d1c8;
  }

  ${Shell} {
    position: relative;
    z-index: 1;
  }
`;

const CarouselTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const DealCard = styled(Link)`
  background: #ffffff;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  display: grid;
  gap: 8px;
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid rgba(231, 64, 49, 0.6);
    outline-offset: 4px;
  }
`;

const DealImage = styled.div`
  background: #f3ead6;
  border-radius: 12px;
  aspect-ratio: 4 / 3;
  position: relative;
  overflow: hidden;
`;

const DealPhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DealBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: #1b1a17;
  color: #ffffff;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 6px;
`;

const DealDiscount = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e74031;
  color: #ffffff;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 6px;
`;

const DealMeta = styled.div`
  font-size: 11px;
  color: #6b645d;
`;

const DealPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 600;
  color: #1b1a17;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DealPriceBlock = styled.div`
  display: grid;
  gap: 4px;
`;

const DealOldPrice = styled.span`
  font-size: 11px;
  color: #9c948b;
  text-decoration: line-through;
`;

const DealNewPrice = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #d61f1f;
`;

const DealUnit = styled.span`
  font-weight: 500;
  color: #6b645d;
  margin-left: 4px;
`;

const StockText = styled.span<{ $inStock?: boolean }>`
  color: ${({ $inStock }) => ($inStock ? "#2e8b57" : "#b42318")};
  font-weight: 600;
`;

const DealEmpty = styled.div`
  font-size: 12px;
  color: #6b645d;
  padding: 10px 0;
`;

const ExclusiveShell = styled.section`
  position: relative;
  background: #ffffff;
  color: #ffffff;
  padding: 36px 0 44px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50%;
    background: #222222;
  }

  ${Shell} {
    position: relative;
    z-index: 1;
  }
`;

const ExclusiveTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const ExclusiveAccent = styled.span`
  color: #e74031;
`;

const CollectionSection = styled.section`
  position: relative;
  background: #ffffff;
  padding: 34px 0 40px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 50%;
    background: #e5e2cf;
  }
`;

const CollectionShell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px 0 20px;
  position: relative;
  z-index: 1;
`;

const CollectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
`;

const CollectionCopy = styled.div`
  display: grid;
  gap: 10px;
  max-width: 480px;
`;

const CollectionDescription = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #6b645d;
  white-space: pre-line;
`;

const CollectionTag = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #e23d2f;
  text-decoration: none;
`;

const TagArrow = styled.span`
  width: 8px;
  height: 8px;
  border-top: 2px solid #e23d2f;
  border-right: 2px solid #e23d2f;
  transform: rotate(45deg);
  display: inline-block;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  grid-template-rows: 1fr;
  gap: 18px;
  align-items: stretch;
  min-height: clamp(240px, 26vw, 320px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    min-height: unset;
  }
`;

const CollectionHero = styled.div`
  height: 100%;
  border-radius: 20px;
  background: url("https://picsum.photos/seed/collection-hero/900/600") center/cover;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);

  @media (max-width: 900px) {
    height: auto;
    min-height: 220px;
  }
`;

const CollectionCards = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: stretch;
  align-self: stretch;
  height: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const CollectionCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-rows: minmax(0, 3fr) minmax(0, 2fr);
  gap: 0;
  height: 100%;
`;

const CollectionCardImage = styled.div`
  border-radius: 12px;
  width: 100%;
  height: 100%;
  background: #f1eee8;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const CollectionCardBody = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 4px;
  padding: 10px 8px 8px;
`;

const CollectionCardInfo = styled.div`
  display: grid;
  gap: 4px;
`;

const CollectionCardTitle = styled.span`
  font-weight: 700;
  font-size: 13px;
`;

const CollectionCardMeta = styled.span`
  font-size: 11px;
  color: #6b645d;
`;

const CollectionCardPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const CollectionCardPrice = styled.span`
  font-size: 13px;
  font-weight: 700;
`;

const CollectionArrow = styled.button`
  position: absolute;
  right: 18px;
  top: 60%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(231, 64, 49, 0.5);
  background: #ffffff;
  display: grid;
  place-items: center;
  color: #e23d2f;
  cursor: pointer;

  @media (max-width: 900px) {
    display: none;
  }
`;

const CollectionDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
`;

const Wallplast = styled.section`
  padding: 36px 20px 60px;
`;

const WallCard = styled.div`
  border-radius: 24px;
  min-height: 320px;
  background: url("https://picsum.photos/seed/wallplast/1200/700") center/cover;
  position: relative;
  overflow: hidden;
`;

const WallOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.4), transparent 60%);
  color: #ffffff;
  padding: 28px;
  display: grid;
  gap: 12px;
  max-width: 420px;
`;

const GhostCta = styled.button`
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
`;

const Partners = styled.section`
  padding: 36px 20px 60px;
  background: #ffffff;
`;

const PartnerGrid = styled.div`
  display: grid;
  gap: 20px;
  justify-items: center;
`;

const PartnerRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(80px, 1fr));
  gap: 24px;
  justify-items: center;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(80px, 1fr));
  }
`;

const PartnerRowBottom = styled(PartnerRow)`
  grid-template-columns: repeat(3, minmax(80px, 1fr));
`;

const PartnerLogo = styled.div`
  width: 80px;
  height: 80px;
  background: #f2efee;
  border-radius: 18px;
`;

const Footer = styled.footer`
  background: #3b3b3b;
  color: #e8e6e0;
  padding: 52px 20px 32px;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 26px;
`;

const FooterTop = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
`;

const FooterLogoMark = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
`;

const FooterLogoDiamond = styled.span<{ $accent?: boolean }>`
  position: absolute;
  width: 14px;
  height: 14px;
  border: 2px solid ${({ $accent }) => ($accent ? "#e74031" : "#f3f1ed")};
  transform: rotate(45deg);
  border-radius: 3px;
`;

const FooterLogoText = styled.span`
  color: #f3f1ed;
`;

const FooterTagline = styled.p`
  margin: 0;
  font-size: 13px;
  color: #cfcac2;
  max-width: 620px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 42px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
  }
`;

const FooterTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 14px;
  color: #ffffff;
`;

const FooterColumn = styled.div`
  display: grid;
  gap: 6px;
  justify-items: start;
`;

const FooterLink = styled.a`
  display: block;
  font-size: 12px;
  color: #cfcac2;
  margin-bottom: 8px;
  text-decoration: none;
`;

const FooterText = styled.p`
  margin: 0 0 8px;
  font-size: 12px;
  color: #cfcac2;
`;

const FooterSaleText = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  color: #cfcac2;
  max-width: 280px;
`;

const Newsletter = styled.div`
  display: grid;
  gap: 10px;
  justify-items: start;
`;

const NewsletterButton = styled.button`
  padding: 12px 18px;
  border-radius: 999px;
  border: none;
  background: #e74031;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 280px;
  max-width: 100%;
`;

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 2px;
`;

const SocialIcon = styled.a`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #e74031;
  color: #ffffff;
  display: grid;
  place-items: center;
  text-decoration: none;

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
    stroke: currentColor;
  }
`;

const FooterBase = styled.div`
  text-align: center;
  font-size: 11px;
  color: #bfbab0;
  margin-top: 8px;
`;

const FooterLinks = styled.div`
  text-align: center;
  font-size: 11px;
  color: #a9a39b;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const BAHT_SYMBOL = "฿";
const PRICE_UNIT = " /ตร.ม.";

function formatPrice(price?: number) {
  if (price === undefined || price === null) return `${BAHT_SYMBOL}-`;
  return `${BAHT_SYMBOL}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}`;
}

function formatPricePlain(price?: number) {
  if (price === undefined || price === null) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
}

function getDiscountedPrice(price?: number, dealPercent?: number) {
  if (price === undefined || price === null) return undefined;
  if (!dealPercent || dealPercent <= 0) return price;
  return Math.round(price * (1 - dealPercent / 100));
}

function resolveInStock(inStock?: boolean) {
  return inStock !== false;
}

function renderNavIcon(type: string) {
  const stroke = "#3e3a35";
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.5 };

  switch (type) {
    case "grid":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 4l8 4-8 4-8-4 8-4z" />
          <path d="M4 12l8 4 8-4" />
        </svg>
      );
    case "cube":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12l-8-4.5" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M5 6h2l2 10h9l2-6H9" />
          <circle cx="10" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      );
    case "user":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.5-3 12.5-3 14 0" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function LandingPageClient() {
  const [categoryItems, setCategoryItems] = useState<Category[]>(fallbackCategories);
  const [latestItems, setLatestItems] = useState<Product[]>(latestFallback);
  const [featuredItems, setFeaturedItems] = useState<Product[]>([]);
  const [dealItems, setDealItems] = useState<Product[]>([]);
  const [latestPage, setLatestPage] = useState(0);
  const [featuredPage, setFeaturedPage] = useState(0);
  const [dealPage, setDealPage] = useState(0);
  const latestPerPage = 6;
  const dealPerPage = 5;

  useEffect(() => {
    const controller = new AbortController();
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories", { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { categories?: Category[] };
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoryItems(data.categories);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadLatest = async () => {
      try {
        const response = await fetch("/api/products?limit=18", { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { products?: Product[] };
        if (Array.isArray(data.products) && data.products.length > 0) {
          setLatestItems(data.products);
          setLatestPage(0);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    loadLatest();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadFeatured = async () => {
      try {
        const response = await fetch("/api/products?featured=true&limit=15", { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { products?: Product[] };
        if (Array.isArray(data.products) && data.products.length > 0) {
          setFeaturedItems(data.products);
          setFeaturedPage(0);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    loadFeatured();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadDeals = async () => {
      try {
        const response = await fetch("/api/products?deal=true&limit=15", { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { products?: Product[] };
        if (Array.isArray(data.products) && data.products.length > 0) {
          setDealItems(data.products);
          setDealPage(0);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    loadDeals();
    return () => controller.abort();
  }, []);

  const latestPageCount = Math.max(1, Math.ceil(latestItems.length / latestPerPage));
  const clampedLatestPage = Math.min(latestPage, latestPageCount - 1);
  const latestStart = clampedLatestPage * latestPerPage;
  const latestSlice = latestItems.slice(latestStart, latestStart + latestPerPage);
  const featuredPageCount = Math.max(1, Math.ceil(featuredItems.length / dealPerPage));
  const clampedFeaturedPage = Math.min(featuredPage, featuredPageCount - 1);
  const featuredStart = clampedFeaturedPage * dealPerPage;
  const featuredSlice = featuredItems.slice(featuredStart, featuredStart + dealPerPage);
  const dealPageCount = Math.max(1, Math.ceil(dealItems.length / dealPerPage));
  const clampedDealPage = Math.min(dealPage, dealPageCount - 1);
  const dealStart = clampedDealPage * dealPerPage;
  const dealSlice = dealItems.slice(dealStart, dealStart + dealPerPage);

  return (
    <Page>
      <TopBar>
        <TopInner>
          <Logo>
            <LogoMark aria-hidden="true">
              <LogoDiamond style={{ top: 2, left: 9 }} />
              <LogoDiamond $accent style={{ top: 8, left: 2 }} />
              <LogoDiamond $accent style={{ top: 8, right: 2 }} />
              <LogoDiamond style={{ bottom: 2, left: 9 }} />
            </LogoMark>
            <BrandText>
              <BrandX>X</BrandX>SURFACE
            </BrandText>
          </Logo>
          <Search>
            <SearchIcon aria-hidden="true" />
            <SearchInput placeholder={ThaiText.searchPlaceholder} />
            <SearchButton>{ThaiText.quickSearch}</SearchButton>
          </Search>
          <NavItems>
            {navItems.map((item) => (
              <NavItem key={item.label}>
                <NavIcon aria-hidden="true">{renderNavIcon(item.icon)}</NavIcon>
                {item.label}
              </NavItem>
            ))}
          </NavItems>
          <LoginButton href="/login">{ThaiText.login}</LoginButton>
          <DotsButton aria-label="More">...</DotsButton>
        </TopInner>
      </TopBar>

      <Banner>
        <div>
          <BannerText>BANNER XSURFACE</BannerText>
          <BannerSubtitle>1440 x 472 px</BannerSubtitle>
        </div>
        <SliderDots>
          <Dot $active />
          <Dot />
          <Dot />
          <Dot />
          <Dot />
        </SliderDots>
      </Banner>

      <CategoryRow>
        <Shell>
          <CategoryGrid>
            {categoryItems.map((category) => (
              <CategoryItem key={category._id}>
                <CategoryIcon />
                <div>{category.name}</div>
              </CategoryItem>
            ))}
          </CategoryGrid>
        </Shell>
      </CategoryRow>

      <Section>
        <Shell>
          <LatestHeader>
            <SectionTitle>{ThaiText.latest}</SectionTitle>
            <SliderControls>
              <ArrowButton
                type="button"
                onClick={() => setLatestPage((prev) => Math.max(0, prev - 1))}
                disabled={clampedLatestPage === 0}
                aria-label="Previous latest products"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </ArrowButton>
              <ArrowButton
                type="button"
                onClick={() => setLatestPage((prev) => Math.min(latestPageCount - 1, prev + 1))}
                disabled={clampedLatestPage >= latestPageCount - 1}
                aria-label="Next latest products"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </ArrowButton>
            </SliderControls>
          </LatestHeader>
          <ProductRow>
            {latestSlice.map((product) => (
              <ProductCard key={product._id} href={`/products/${product._id}`}>
                <ProductImage>
                  {product.images?.[0] ? (
                    <ProductPhoto src={product.images[0]} alt={product.name} loading="lazy" />
                  ) : null}
                </ProductImage>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{formatPrice(product.price)}</ProductPrice>
              </ProductCard>
            ))}
          </ProductRow>
          <DotsRow>
            {Array.from({ length: latestPageCount }).map((_, index) => (
              <Dot key={`latest-dot-${index}`} $active={index === clampedLatestPage} />
            ))}
          </DotsRow>
        </Shell>
      </Section>

      <CarouselShell>
        <Shell>
          <SectionHeader>
            <SectionTitle>{ThaiText.popular}</SectionTitle>
            <HeaderControls>
              <ViewAll href="/products">{ThaiText.viewAll}</ViewAll>
              <SliderControls>
                <ArrowButton
                  type="button"
                  onClick={() => setFeaturedPage((prev) => Math.max(0, prev - 1))}
                  disabled={clampedFeaturedPage === 0}
                  aria-label="Previous featured products"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ArrowButton>
                <ArrowButton
                  type="button"
                  onClick={() => setFeaturedPage((prev) => Math.min(featuredPageCount - 1, prev + 1))}
                  disabled={clampedFeaturedPage >= featuredPageCount - 1}
                  aria-label="Next featured products"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ArrowButton>
              </SliderControls>
            </HeaderControls>
          </SectionHeader>
          <CarouselTrack>
            {featuredItems.length === 0 ? (
              <DealEmpty>No featured products yet.</DealEmpty>
            ) : (
              featuredSlice.map((product) => (
                <DealCard key={product._id} href={`/products/${product._id}`}>
                  <DealImage>
                    {product.images?.[0] ? (
                      <DealPhoto src={product.images[0]} alt={product.name} loading="lazy" />
                    ) : null}
                    <DealBadge>exclusive deal</DealBadge>
                    {product.dealPercent ? <DealDiscount>-{product.dealPercent}%</DealDiscount> : null}
                  </DealImage>
                  <div>
                    <strong>{product.name}</strong>
                    <DealMeta>{product.code}</DealMeta>
                    <DealMeta>{product.description ?? "W60 x H100 x D4.5 cm."}</DealMeta>
                  </div>
                  <DealPriceRow>
                    <DealPriceBlock>
                      {product.dealPercent ? (
                        <DealOldPrice>{formatPrice(product.price)}</DealOldPrice>
                      ) : null}
                      <div>
                        <DealNewPrice>
                          {formatPricePlain(getDiscountedPrice(product.price, product.dealPercent))}
                        </DealNewPrice>
                        <DealUnit>{PRICE_UNIT}</DealUnit>
                      </div>
                    </DealPriceBlock>
                    <StockText $inStock={resolveInStock(product.inStock)}>
                      {resolveInStock(product.inStock) ? "In stock" : "Out of stock"}
                    </StockText>
                  </DealPriceRow>
                </DealCard>
              ))
            )}
          </CarouselTrack>
          <DotsRow>
            {Array.from({ length: featuredPageCount }).map((_, index) => (
              <Dot key={`featured-dot-${index}`} $active={index === clampedFeaturedPage} />
            ))}
          </DotsRow>
        </Shell>
      </CarouselShell>

      <ExclusiveShell>
        <Shell>
          <SectionHeader>
            <ExclusiveTitle>
              <ExclusiveAccent>{ThaiText.exclusive.slice(0, 1)}</ExclusiveAccent>
              {ThaiText.exclusive.slice(1)}
            </ExclusiveTitle>
            <HeaderControls>
              <ViewAll href="/products" style={{ color: "#ffffff" }}>
                {ThaiText.viewAll}
              </ViewAll>
              <SliderControls>
                <ArrowButton
                  type="button"
                  onClick={() => setDealPage((prev) => Math.max(0, prev - 1))}
                  disabled={clampedDealPage === 0}
                  aria-label="Previous deal products"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ArrowButton>
                <ArrowButton
                  type="button"
                  onClick={() => setDealPage((prev) => Math.min(dealPageCount - 1, prev + 1))}
                  disabled={clampedDealPage >= dealPageCount - 1}
                  aria-label="Next deal products"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </ArrowButton>
              </SliderControls>
            </HeaderControls>
          </SectionHeader>
          <CarouselTrack>
            {dealItems.length === 0 ? (
              <DealEmpty>No deal products yet.</DealEmpty>
            ) : (
              dealSlice.map((product) => (
                <DealCard key={`${product._id}-x`} href={`/products/${product._id}`}>
                  <DealImage>
                    {product.images?.[0] ? (
                      <DealPhoto src={product.images[0]} alt={product.name} loading="lazy" />
                    ) : null}
                    <DealBadge>exclusive deal</DealBadge>
                    {product.dealPercent ? <DealDiscount>-{product.dealPercent}%</DealDiscount> : null}
                  </DealImage>
                  <div>
                    <strong>{product.name}</strong>
                    <DealMeta>{product.code}</DealMeta>
                    <DealMeta>{product.description ?? "W60 x H100 x D4.5 cm."}</DealMeta>
                  </div>
                  <DealPriceRow>
                    <DealPriceBlock>
                      {product.dealPercent ? (
                        <DealOldPrice>{formatPrice(product.price)}</DealOldPrice>
                      ) : null}
                      <div>
                        <DealNewPrice>
                          {formatPricePlain(getDiscountedPrice(product.price, product.dealPercent))}
                        </DealNewPrice>
                        <DealUnit>{PRICE_UNIT}</DealUnit>
                      </div>
                    </DealPriceBlock>
                    <StockText $inStock={resolveInStock(product.inStock)}>
                      {resolveInStock(product.inStock) ? "In stock" : "Out of stock"}
                    </StockText>
                  </DealPriceRow>
                </DealCard>
              ))
            )}
          </CarouselTrack>
          <DotsRow>
            {Array.from({ length: dealPageCount }).map((_, index) => (
              <Dot key={`deal-dot-${index}`} $active={index === clampedDealPage} />
            ))}
          </DotsRow>
        </Shell>
      </ExclusiveShell>

      <CollectionSection>
        <CollectionShell>
          <CollectionHeader>
            <CollectionCopy>
              <SectionTitle>{ThaiText.collections}</SectionTitle>
              <CollectionDescription>{ThaiText.collectionDesc}</CollectionDescription>
            </CollectionCopy>
            <CollectionTag href="/products">
              {ThaiText.collectionAll}
              <TagArrow aria-hidden="true" />
            </CollectionTag>
          </CollectionHeader>
          <CollectionGrid>
            <CollectionHero />
            <CollectionCards>
              <CollectionCard>
                <CollectionCardImage />
                <CollectionCardBody>
                  <CollectionCardInfo>
                    <CollectionCardTitle>FUVAL (Silver)</CollectionCardTitle>
                    <CollectionCardMeta>CODE12345678</CollectionCardMeta>
                    <CollectionCardMeta>W60 x H100 x D4.5 cm.</CollectionCardMeta>
                  </CollectionCardInfo>
                  <div />
                  <CollectionCardPriceRow>
                    <CollectionCardPrice>฿550</CollectionCardPrice>
                    <CollectionCardMeta>/ตร.ม.</CollectionCardMeta>
                  </CollectionCardPriceRow>
                </CollectionCardBody>
              </CollectionCard>
              <CollectionCard>
                <CollectionCardImage />
                <CollectionCardBody>
                  <CollectionCardInfo>
                    <CollectionCardTitle>FUVAL (Silver)</CollectionCardTitle>
                    <CollectionCardMeta>CODE12345679</CollectionCardMeta>
                    <CollectionCardMeta>W60 x H100 x D4.5 cm.</CollectionCardMeta>
                  </CollectionCardInfo>
                  <div />
                  <CollectionCardPriceRow>
                    <CollectionCardPrice>฿550</CollectionCardPrice>
                    <CollectionCardMeta>/ตร.ม.</CollectionCardMeta>
                  </CollectionCardPriceRow>
                </CollectionCardBody>
              </CollectionCard>
            </CollectionCards>
          </CollectionGrid>
          <CollectionArrow type="button" aria-label="Next collections">
            <TagArrow aria-hidden="true" />
          </CollectionArrow>
          <CollectionDots>
            <Dot $active />
            <Dot />
            <Dot />
            <Dot />
          </CollectionDots>
        </CollectionShell>
      </CollectionSection>

      <Wallplast>
        <Shell>
          <WallCard>
            <WallOverlay>
              <h3>Wallplast</h3>
              <p>
                Modern wall panels and accessories designed to match premium interiors. Explore the design library and
                curated collections.
              </p>
              <GhostCta>View more &gt;</GhostCta>
            </WallOverlay>
          </WallCard>
        </Shell>
      </Wallplast>

      <Partners>
        <Shell>
          <SectionHeader>
            <SectionTitle>{ThaiText.partners}</SectionTitle>
          </SectionHeader>
          <PartnerGrid>
            <PartnerRow>
              {partnerLogos.slice(0, 4).map((logo) => (
                <div key={logo}>
                  <PartnerLogo />
                </div>
              ))}
            </PartnerRow>
            <PartnerRowBottom>
              {partnerLogos.slice(4, 7).map((logo) => (
                <div key={logo}>
                  <PartnerLogo />
                </div>
              ))}
            </PartnerRowBottom>
          </PartnerGrid>
        </Shell>
      </Partners>

      <Footer>
        <FooterInner>
          <FooterTop>
            <FooterLogo>
              <FooterLogoMark aria-hidden="true">
                <FooterLogoDiamond style={{ top: 2, left: 9 }} />
                <FooterLogoDiamond $accent style={{ top: 8, left: 2 }} />
                <FooterLogoDiamond $accent style={{ top: 8, right: 2 }} />
                <FooterLogoDiamond style={{ bottom: 2, left: 9 }} />
              </FooterLogoMark>
              <FooterLogoText>
                <BrandX>X</BrandX>SURFACE
              </FooterLogoText>
            </FooterLogo>
            <FooterTagline>เรื่องวัสดุปูผิว การตกแต่ง มารวมกันในแพลตฟอร์มที่เน้นการออกแบบ</FooterTagline>
          </FooterTop>

          <FooterGrid>
            <FooterColumn>
              <FooterTitle>เกี่ยวกับเรา</FooterTitle>
              <FooterLink href="#">เกี่ยวกับเรา</FooterLink>
              <FooterLink href="#">สมัครงาน</FooterLink>
              <FooterLink href="#">คำถามที่พบบ่อย</FooterLink>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>ติดต่อเรา</FooterTitle>
              <FooterText>เอ็กซ์เซอร์เฟส 53 ซอย สุขุมวิท 62, บางจาก,</FooterText>
              <FooterText>พระโขนง, กรุงเทพฯ 10260</FooterText>
              <FooterText>อีเมล: support@xsurface.com</FooterText>
              <FooterText>โทร: +66 65-656-2887</FooterText>
            </FooterColumn>
            <Newsletter>
              <FooterSaleText>สมัครขาย? กล่องกับเราได้เลย ฟรี ไม่มีค่าใช้จ่าย</FooterSaleText>
              <NewsletterButton>ลงขายสินค้ากับเรา</NewsletterButton>
            </Newsletter>
          </FooterGrid>

          <SocialRow>
            <SocialIcon href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h3l1-3h-4V9c0-.6.4-1 1-1z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="6" y="6" width="12" height="12" rx="3" />
                <circle cx="12" cy="12" r="3.2" />
                <circle cx="16.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 4c.6 2.2 2.3 3.8 4.6 4v3.2c-1.7-.1-3.3-.7-4.6-1.7v6.1c0 2.4-2 4.4-4.4 4.4S5.2 18.1 5.2 15.7s2-4.4 4.4-4.4c.4 0 .9.1 1.3.2v3.3c-.4-.2-.8-.3-1.3-.3-1 0-1.9.9-1.9 2s.9 2 1.9 2 2-.8 2-1.9V4h3.1z" />
              </svg>
            </SocialIcon>
          </SocialRow>

          <FooterBase>&copy; 2021. Copyright of XSURFACE Co., Ltd.</FooterBase>
          <FooterLinks>
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>ข้อกำหนด และเงื่อนไข</span>
          </FooterLinks>
        </FooterInner>
      </Footer>
    </Page>
  );
}
