const truncateStr = (fullStr:string, strLength:number) => {
    if(fullStr.length <= strLength) return fullStr;

    const separator = "..."
    const separatorLength = separator.length;
    const charsToShow = strLength - separatorLength;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars);
}

export { truncateStr }

