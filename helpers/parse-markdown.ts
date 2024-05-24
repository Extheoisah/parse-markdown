import fs from "fs";
import matter from "gray-matter";

type sections = {
  [x: string]: string;
}[];

export const parseMarkdown = (path?: string) => {
  const filePath =
    `${process.cwd()}/public/example.md` || `${process.cwd()}/${path}`;
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  return { data, content };
};

export const getSections = (content: string) => {
  // check for html comment stlye in markdown
  // split content if found <!-- at the beginning of the line
  // and --> at the end of the line
  const beginning = "<!--";
  const ending = "-->";
  // map headers to sections
  // the section that follows the header is the section
  // that the header belongs to
  // return an object with the header as the key and the section as the value
  const headers = content.split("\n").filter((line) => line.startsWith("#"));
  const sections = content
    .split(beginning)
    .filter((section) => section.includes(ending))
    .join(beginning);
  const sectionsArray = sections
    .split(beginning)
    .filter((section) => section.includes(ending));
  const sectionsMap = headers.map((header, index) => {
    return {
      [header]: sectionsArray[index],
    };
  });
  return sectionsMap;
};

export const extractSectionContent = ({
  content,
  identifier,
}: {
  content: sections;
  identifier: string;
}) => {
  const expandableSections = content.filter((section) => {
    return Object.values(section)
      .map((value) => value.toLowerCase())
      .join("")
      .includes(identifier);
  });
  // remove "/n" and "\n" from the expandable sections
  const expandableSectionsArray = expandableSections.map((section) => {
    return Object.values(section).map((value) => value.replace(/\n/g, ""));
  });

  return expandableSectionsArray;
};

// extract content by element tag
// only extract content that is wrapped in the tag
// e.g. extract all content that is wrapped in a <div> tag
export const extractContentByElementTag = ({
  content,
  tag,
}: {
  content: string;
  tag: string;
}) => {
  const beginning = `<${tag}>`;
  const ending = `</${tag}>`;
  const firstIndex = content.indexOf(beginning);
  const lastIndex = content.indexOf(ending);
  const body = content.slice(firstIndex + beginning.length, lastIndex)?.trim();
  return body;
};
