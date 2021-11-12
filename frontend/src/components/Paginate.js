import React from 'react';
import { Pagination } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

export const pageSize = 20;

const Paginate = ({ data, action }) => {
  const dispatch = useDispatch();

  const { count, next, previous } = data;
  const totalPage = Math.ceil(count / pageSize);

  let currentPage = 0;
  let pageLink = null;
  if (next) {
    currentPage = parseInt(next.match(/page=\d+/)[0].match(/\d+/)[0]) - 1;
    pageLink = next;
  }

  if (!pageLink && previous) {
    try {
      currentPage = parseInt(previous.match(/page=\d+/)[0].match(/\d+/)[0]) + 1;
    } catch (e) {
      currentPage = 2;
    }
    pageLink = previous;
  }

  const getPage = (page) => {
    if (pageLink) {
      dispatch(action(pageLink.replace(/page=\d+/, `page=${page}`)));
    }
  };

  return (
    <>
      {pageLink && (
        <Pagination>
          {[...Array(totalPage).keys()].map((x) => (
            <Pagination.Item
              key={x}
              active={currentPage === x + 1}
              onClick={() => getPage(x + 1)}
            >
              {x + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
