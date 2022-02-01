const { pagination, sort, filter } = require("../config");

exports.paginationParams = ({
  limit = pagination.limit,
  page = pagination.page,
  skip = pagination.skip,
}) => {
  return {
    limit: Number(limit),
    page: Number(page),
    skip: skip ? Number(skip) : (Number(page) - 1) * Number(limit),
  };
};

exports.sortParams = (
  { sortBy = sort.sortBy.default, direction = sort.direction.default },
  fields
) => {
  const safeList = {
    sortBy: [Object.getOwnPropertyNames(fields), ...sort.sortBy.fields],
    direction: [...sort.direction.options],
  };
  return {
    sortBy: safeList.sortBy.includes(sortBy) ? sortBy : sort.sortBy.default,
    direction: safeList.direction.includes(direction)
      ? direction
      : sort.direction.default,
  };
};

exports.sortParamToString = (sortBy, direction) => {
  const dir = direction === "desc" ? "-" : "";
  return `${dir}${sortBy}`;
};

exports.filterOption = (fields) => {
  // TODO: allow some nested properties as fields e.g. characteristics: color, name, age,etc
  const queryFields = Object.getOwnPropertyNames(fields);
  const curatedFields = queryFields.filter((field) =>
    filter.options.includes(field)
  );
  if (!curatedFields) return {};

  const filterBy = curatedFields.reduce((acc, field) => {
    acc[field] = fields[field];
    return acc;
  }, {});

  return filterBy;
};
