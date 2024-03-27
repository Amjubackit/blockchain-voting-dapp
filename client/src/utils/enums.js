const RoleEnum = Object.freeze({
	ADMIN: 1,
	USER: 2,
});

const ElectionStateEnum = Object.freeze({
	NOT_STARTED: 0,
	IN_PROGRESS: 1,
	ENDED: 2,
});

export { ElectionStateEnum };
export default RoleEnum;
