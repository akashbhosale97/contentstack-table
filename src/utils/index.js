export function alignText(text) {
  if (text === 'version') {
    return 'align-right';
  } else if (text === 'publish status') {
    return 'align-center';
  } else {
    return 'align-left';
  }
}

export function displayFilter(text) {
  if (
    text === 'content type' ||
    text === 'publish status' ||
    text === 'modified at'
  ) {
    return true;
  } else if (text === 'id' || text === 'actions') {
    return false;
  }
}

export function getContentTypes(data) {
  const uniqueContentTypes = new Set(data.map((item) => item['content type']));
  return [...uniqueContentTypes].map((contentType) => ({
    contentType,
    checked: true,
  }));
}

export function getPublishStatus(data) {
  const uniquePublishStatus = new Set(
    data.map((item) => item['publish status'])
  );
  return [...uniquePublishStatus];
}
