export const msInDay = 24 * 60 * 60 * 1000;

export const formatDate = (time: number) => {
	const date = new Date(time);
	return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
};

export const formatDatetime = (time: number) => {
	const date = new Date(time);
	return `${formatDate(time)} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};
